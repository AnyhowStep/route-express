import * as tape from "tape";
import * as tm from "type-mapping/fluent";
import * as express from "express";
import * as http from "http";
import * as axios from "axios";
import * as crypto from "crypto";

/*
    Some mappers to make data validation easier.
*/
const fields = tm.fields({
    //User
    username : tm.mysql.varChar(5, 42),
    //Please never store plain text passwords in real life
    password : tm.mysql.varChar(10, 255),
    emailAddress : tm.emailAddress(),
    userId : tm.mysql.bigIntUnsigned(),
    accessToken : tm.hexadecimalString().pipe(tm.mysql.varChar(32, 255)),

    //Todo list
    todoListId : tm.mysql.bigIntUnsigned(),
    title : tm.mysql.varChar(1, 32),

    //Items
    itemId : tm.mysql.bigIntUnsigned(),
    name : tm.mysql.varChar(1, 32),
    description : tm.mysql.text(),
    done : tm.mysql.boolean(),
});
//For /auth endpoints
const registerBody = tm.object(
    fields.emailAddress,
    fields.username,
    fields.password,
);
const logInBody = tm.object(
    fields.emailAddress,
    fields.password,
);
const logInResponse = tm.object(
    fields.username,
    fields.accessToken,
);

//For /me endpoints
const meHeader = tm.object({
    "access-token" : fields.accessToken,
});
const meResponse = tm.object(
    fields.userId,
    fields.emailAddress,
    fields.username,
);
const todoListIdentifier = tm.object(
    fields.todoListId,
);
const todoListCreateBody = tm.object(
    fields.title,
);
const todoListResponse = tm.object(
    fields.todoListId,
    fields.title,
    tm.object(
        fields.itemId,
        fields.name,
        fields.done,
    ).array().withName("items"),
);
const itemIdentifier = tm.object(
    fields.todoListId,
    fields.itemId,
);
const itemCreateBody = tm.object(
    fields.name,
    fields.description,
);
const itemUpdateBody = tm.object(
    fields.name.optional(),
    fields.description.optional(),
    fields.done.optional(),
);
const itemResponse = tm.object(
    fields.itemId,
    fields.name,
    fields.description,
    fields.done,
);

tape(__filename, async (t) => {
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const users : {
            userId : bigint,
            emailAddress : string,
            username : string,
            //Please never store plain text passwords in real life
            password : string,
        }[] = [];
        const accessTokens : {
            accessToken : string,
            userId : bigint,
        }[] = [];
        const todoLists : {
            todoListId : bigint,
            userId : bigint,
            title : string,
            items : {
                itemId : bigint,
                name : string,
                description : string,
                done : boolean,
            }[],
        }[] = [];


        const app = express();
        //Explicitly add `express.json()` middleware
        app.use(express.json());
        const authApp = express();
        const meApp = express();

        app.use("/auth", authApp);
        app.use("/me", meApp);

        authApp.post("/register", (req, res) => {
            const body = registerBody("req.body", req.body);
            if (users.some(u => u.emailAddress == body.emailAddress)) {
                res.status(422).json({
                    error : "Email address in use",
                });
            } else {
                users.push({
                    userId : BigInt(users.length+1),
                    //Please never store plain text passwords in real life
                    ...body,
                });
                res.status(204).end();
            }
        });
        authApp.post("/log-in", (req, res) => {
            const body = logInBody("req.body", req.body);
            const user = users.find(u => u.emailAddress == body.emailAddress);
            if (user == undefined) {
                res.status(422).json({
                    error : "Invalid email address or password",
                });
                return;
            }
            //Please never store plain text passwords in real life
            if (user.password != body.password) {
                res.status(422).json({
                    error : "Invalid email address or password",
                });
                return;
            }
            const accessToken = {
                accessToken : crypto.randomBytes(64).toString("hex"),
                userId : user.userId,
            };
            accessTokens.push(accessToken);
            res.json(logInResponse.map("response", {
                username : user.username,
                accessToken : accessToken.accessToken,
            }));
        });

        meApp.use((req, res, next) => {
            const headerResult = meHeader.tryMapHandled("req.headers", req.headers);
            if (!headerResult.success) {
                res.status(401).json({
                    error : "Please log in first",
                });
                return;
            }
            const headers = headerResult.value;
            const accessToken = accessTokens.find(a => a.accessToken == headers["access-token"]);
            if (accessToken == undefined) {
                res.status(401).json({
                    error : "Please log in first",
                });
                return;
            }
            const user = users.find(u => u.userId == accessToken.userId);
            if (user == undefined) {
                res.status(500).json({
                    error : "Could not find user; try loggin in again",
                });
                return;
            }
            //Set the user information for this request
            //With @types/express, `res.locals` is of type `any`
            res.locals.user = user;
            next();
        });
        meApp.get("/", (_req, res) => {
            //With @types/express, `res.locals` is of type `any`
            res.json(meResponse.map("response", res.locals.user));
        });
        meApp.post("/todo-list", (req, res) => {
            const body = todoListCreateBody("req.body", req.body);
            todoLists.push({
                todoListId : BigInt(todoLists.length+1),
                //With @types/express, `res.locals` is of type `any`
                userId : res.locals.user.userId,
                title : body.title,
                items : [],
            });
            const result = todoLists[todoLists.length-1];
            res.json(todoListResponse.map("response", result));
        });
        meApp.get("/todo-list/:todoListId(\\d+)", (req, res) => {
            const params = todoListIdentifier("req.params", req.params);
            const todoList = todoLists.find(t => (
                t.todoListId == params.todoListId &&
                //With @types/express, `res.locals` is of type `any`
                t.userId == res.locals.user.userId
            ));
            if (todoList == undefined) {
                res.status(404).json({
                    error : "Todo list not found",
                });
                return;
            }
            res.json(todoListResponse.map("response", todoList));
        });
        meApp.post("/todo-list/:todoListId(\\d+)/item", (req, res) => {
            const params = todoListIdentifier("req.params", req.params);
            const todoList = todoLists.find(t => (
                t.todoListId == params.todoListId &&
                //With @types/express, `res.locals` is of type `any`
                t.userId == res.locals.user.userId
            ));
            if (todoList == undefined) {
                res.status(404).json({
                    error : "Todo list not found",
                });
                return;
            }
            const body = itemCreateBody("req.body", req.body);
            todoList.items.push({
                itemId : BigInt(todoList.items.length + 1),
                ...body,
                done : false,
            });
            res.json(itemResponse("response", todoList.items[todoList.items.length-1]));
        });
        meApp.get("/todo-list/:todoListId(\\d+)/item/:itemId(\\d+)", (req, res) => {
            const params = itemIdentifier("req.params", req.params);
            const todoList = todoLists.find(t => (
                t.todoListId == params.todoListId &&
                //With @types/express, `res.locals` is of type `any`
                t.userId == res.locals.user.userId
            ));
            if (todoList == undefined) {
                res.status(404).json({
                    error : "Todo list not found",
                });
                return;
            }
            const item = todoList.items.find(i => i.itemId == params.itemId);
            if (item == undefined) {
                res.status(404).json({
                    error : "Item not found",
                });
                return;
            }
            res.json(itemResponse("response", item));
        });
        meApp.put("/todo-list/:todoListId(\\d+)/item/:itemId(\\d+)", (req, res) => {
            const params = itemIdentifier("req.params", req.params);
            const todoList = todoLists.find(t => (
                t.todoListId == params.todoListId &&
                //With @types/express, `res.locals` is of type `any`
                t.userId == res.locals.user.userId
            ));
            if (todoList == undefined) {
                res.status(404).json({
                    error : "Todo list not found",
                });
                return;
            }
            const item = todoList.items.find(i => i.itemId == params.itemId);
            if (item == undefined) {
                res.status(404).json({
                    error : "Item not found",
                });
                return;
            }
            const body = itemUpdateBody("req.body", req.body);
            if (body.name != undefined) {
                item.name = body.name;
            }
            if (body.description != undefined) {
                item.description = body.description;
            }
            if (body.done != undefined) {
                item.done = body.done;
            }
            res.json(itemResponse("response", item));
        });

        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const sender = axios.default.create({
        baseURL : `http://localhost:${port}`,
        responseType : `json`,
    });

    //Attempt to access without logging in
    await sender.get("/me")
        .then(() => {
            t.fail("Should not work without logging in");
        })
        .catch((err) => {
            t.deepEqual(err.response.status, 401);
        });

    //Register
    await sender.post("/auth/register", registerBody.map("body", {
        emailAddress : "test@test.com",
        username : "tester",
        password : "qwerty1234qwerty",
    })).then((result) => {
        t.deepEqual(result.status, 204);
    });

    //Log In
    const logInResult = await sender.post("/auth/log-in", logInBody.map("body", {
        emailAddress : "test@test.com",
        password : "qwerty1234qwerty",
    })).then((result) => {
        return logInResponse.map("response", result.data);
    });

    //Access own information
    await sender.get("/me", {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        const me = meResponse.map("response", result.data);
        t.deepEqual(me, {
            username : "tester",
            emailAddress : "test@test.com",
            userId : BigInt(1),
        });
    });

    //Create todo list
    const createTodoListResult = await sender.post("/me/todo-list", todoListCreateBody.map("body", {
        title : "My First Todo List",
    }), {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        return todoListResponse.map("response", result.data);
    });
    t.deepEqual(createTodoListResult, {
        todoListId : BigInt(1),
        title : "My First Todo List",
        items : [],
    });

    //Create item
    const createItemResult = await sender.post("/me/todo-list/"+createTodoListResult.todoListId+"/item", itemCreateBody.map("body", {
        name : "Buy Fruits",
        description : "Vitamin C is important",
    }), {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        return itemResponse.map("response", result.data);
    });
    t.deepEqual(createItemResult, {
        itemId : BigInt(1),
        name : "Buy Fruits",
        description : "Vitamin C is important",
        done : false,
    });

    //Update item
    const updateItemResult = await sender.put("/me/todo-list/"+createTodoListResult.todoListId+"/item/"+createItemResult.itemId, itemUpdateBody.map("body", {
        done : true,
    }), {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        return itemResponse.map("response", result.data);
    });
    t.deepEqual(updateItemResult, {
        itemId : BigInt(1),
        name : "Buy Fruits",
        description : "Vitamin C is important",
        done : true,
    });

    //Fetch todo list
    const fetchTodoListResult = await sender.get("/me/todo-list/"+createTodoListResult.todoListId, {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        return todoListResponse.map("response", result.data);
    });
    t.deepEqual(fetchTodoListResult, {
        todoListId : BigInt(1),
        title : "My First Todo List",
        items : [
            {
                itemId : BigInt(1),
                name : "Buy Fruits",
                done : true,
            }
        ],
    });

    //Fetch item
    const fetchItemResult = await sender.get("/me/todo-list/"+createTodoListResult.todoListId+"/item/"+createItemResult.itemId, {
        headers : {
            "access-token" : logInResult.accessToken,
        }
    }).then((result) => {
        return itemResponse.map("response", result.data);
    });
    t.deepEqual(fetchItemResult, {
        itemId : BigInt(1),
        name : "Buy Fruits",
        description : "Vitamin C is important",
        done : true,
    });

    await new Promise((resolve) => {
        server.close(resolve);
    });


    t.end();
});