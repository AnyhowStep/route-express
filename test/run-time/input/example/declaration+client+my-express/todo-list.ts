import * as tape from "tape";
import * as crypto from "crypto";
import * as tm from "type-mapping/fluent";
import * as http from "http";
import {route} from "route-declaration";
import {toAxiosApi} from "route-client";
import * as express from "../../../../../dist";

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
const AuthApi = toAxiosApi({
    register : route()
        .append("/register")
        .setBody(tm.object(
            fields.emailAddress,
            fields.username,
            fields.password,
        )),
    logIn : route()
        .append("/log-in")
        .setBody(tm.object(
            fields.emailAddress,
            fields.password,
        ))
        .setResponse(tm.object(
            fields.username,
            fields.accessToken,
        )),
});
const todoListResponse = tm.object(
    fields.todoListId,
    fields.title,
    tm.object(
        fields.itemId,
        fields.name,
        fields.done,
    ).array().withName("items"),
);
const itemResponse = tm.object(
    fields.itemId,
    fields.name,
    fields.description,
    fields.done,
);
const MeApi = toAxiosApi({
    fetchMe : route()
        .setResponse(tm.object(
            fields.userId,
            fields.emailAddress,
            fields.username,
        )),
    createTodoList : route()
        .append("/todo-list")
        .setBody(tm.object(
            fields.title,
        ))
        .setResponse(todoListResponse),
    fetchTodoList : route()
        .append("/todo-list")
        .appendParam(fields.todoListId, /\d+/)
        .setResponse(todoListResponse),
    createItem : route()
        .append("/todo-list")
        .appendParam(fields.todoListId, /\d+/)
        .append("/item")
        .setBody(tm.object(
            fields.name,
            fields.description,
        ))
        .setResponse(itemResponse),
    fetchItem : route()
        .append("/todo-list")
        .appendParam(fields.todoListId, /\d+/)
        .append("/item")
        .appendParam(fields.itemId, /\d+/)
        .setResponse(itemResponse),
    updateItem : route()
        .setMethod("PUT")
        .append("/todo-list")
        .appendParam(fields.todoListId, /\d+/)
        .append("/item")
        .appendParam(fields.itemId, /\d+/)
        .setBody(tm.object(
            fields.name.optional(),
            fields.description.optional(),
            fields.done.optional(),
        ))
        .setResponse(itemResponse),
});
//For /me endpoints
const meHeader = tm.object({
    "access-token" : fields.accessToken,
});

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


        //No need to explicitly add express.json() middleware
        const app = express.app();
        const authApp = app.createSubApp("/auth");

        authApp.createRoute(AuthApi.routes.register)
            .voidHandler((req, res) => {
                if (users.some(u => u.emailAddress == req.body.emailAddress)) {
                    res.status(422).json({
                        error : "Email address in use",
                    });
                } else {
                    users.push({
                        userId : BigInt(users.length+1),
                        //Please never store plain text passwords in real life
                        ...req.body,
                    });
                    res.status(204).end();
                }
            })
        authApp.createRoute(AuthApi.routes.logIn)
            .voidHandler((req, res) => {
                const user = users.find(u => u.emailAddress == req.body.emailAddress);
                if (user == undefined) {
                    res.status(422).json({
                        error : "Invalid email address or password",
                    });
                    return;
                }
                //Please never store plain text passwords in real life
                if (user.password != req.body.password) {
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
                res.json({
                    username : user.username,
                    accessToken : accessToken.accessToken,
                });
            });

        const meApp = app.createSubApp("/me")
            .valueHandler<{
                user : {
                    userId : bigint,
                    emailAddress : string,
                    username : string,
                }
            }>((req, res, next) => {
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
                next.success({
                    user,
                });
            });
        meApp.createRoute(MeApi.routes.fetchMe)
            .voidHandler((_req, res) => {
                /*
                    `res.locals` is of type,
                    ```ts
                    {
                        user: {
                            userId: bigint;
                            emailAddress: string;
                            username: string;
                        };
                    }
                    ```
                */
                res.json(res.locals.user);
            });
        meApp.createRoute(MeApi.routes.createTodoList)
            .voidHandler((req, res) => {
                todoLists.push({
                    todoListId : BigInt(todoLists.length+1),
                    userId : res.locals.user.userId,
                    title : req.body.title,
                    items : [],
                });
                const result = todoLists[todoLists.length-1];
                res.json(result);
            });
        meApp.createRoute(MeApi.routes.fetchTodoList)
            .voidHandler((req, res) => {
                const todoList = todoLists.find(t => (
                    t.todoListId == req.params.todoListId &&
                    //With @types/express, `res.locals` is of type `any`
                    t.userId == res.locals.user.userId
                ));
                if (todoList == undefined) {
                    res.status(404).json({
                        error : "Todo list not found",
                    });
                    return;
                }
                res.json(todoList);
            });
        meApp.createRoute(MeApi.routes.createItem)
            .voidHandler((req, res) => {
                const todoList = todoLists.find(t => (
                    t.todoListId == req.params.todoListId &&
                    //With @types/express, `res.locals` is of type `any`
                    t.userId == res.locals.user.userId
                ));
                if (todoList == undefined) {
                    res.status(404).json({
                        error : "Todo list not found",
                    });
                    return;
                }
                todoList.items.push({
                    itemId : BigInt(todoList.items.length + 1),
                    ...req.body,
                    done : false,
                });
                res.json(todoList.items[todoList.items.length-1]);
            });
        meApp.createRoute(MeApi.routes.fetchItem)
            .voidHandler((req, res) => {
                const todoList = todoLists.find(t => (
                    t.todoListId == req.params.todoListId &&
                    //With @types/express, `res.locals` is of type `any`
                    t.userId == res.locals.user.userId
                ));
                if (todoList == undefined) {
                    res.status(404).json({
                        error : "Todo list not found",
                    });
                    return;
                }
                const item = todoList.items.find(i => i.itemId == req.params.itemId);
                if (item == undefined) {
                    res.status(404).json({
                        error : "Item not found",
                    });
                    return;
                }
                res.json(itemResponse("response", item));
            });
        meApp.createRoute(MeApi.routes.updateItem)
            .voidHandler((req, res) => {
                const todoList = todoLists.find(t => (
                    t.todoListId == req.params.todoListId &&
                    //With @types/express, `res.locals` is of type `any`
                    t.userId == res.locals.user.userId
                ));
                if (todoList == undefined) {
                    res.status(404).json({
                        error : "Todo list not found",
                    });
                    return;
                }
                const item = todoList.items.find(i => i.itemId == req.params.itemId);
                if (item == undefined) {
                    res.status(404).json({
                        error : "Item not found",
                    });
                    return;
                }
                if (req.body.name != undefined) {
                    item.name = req.body.name;
                }
                if (req.body.description != undefined) {
                    item.description = req.body.description;
                }
                if (req.body.done != undefined) {
                    item.done = req.body.done;
                }
                res.json(itemResponse("response", item));
            });

        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const authApi = new AuthApi({
        domain : `http://localhost:${port}`,
        root : "/auth",
    });

    //Register
    authApi.register()
        .setBody({
            emailAddress : "test@test.com",
            username : "tester",
            password : "qwerty1234qwerty",
        })
        .send()
        .then((result) => {
            t.deepEqual(result.status, 204);
        });

    //Log In
    const logInResult = await authApi.logIn()
        .setBody({
            emailAddress : "test@test.com",
            password : "qwerty1234qwerty",
        })
        .send()
        .then((result) => {
            return result.responseBody;
        });

    //You can technically create a class that wraps `MeApi`
    //and forces you to give an access token
    //instead of having to manually specify the
    //`onInjectHeader` delegate
    const meApi = new MeApi({
        domain : `http://localhost:${port}`,
        root : "/me",
        onInjectHeader : () => {
            return {
                "access-token" : logInResult.accessToken,
            };
        },
    });
    //Access own information
    meApi.fetchMe()
        .send()
        .then((result) => {
            t.deepEqual(result.responseBody, {
                username : "tester",
                emailAddress : "test@test.com",
                userId : BigInt(1),
            });
        });

    //Create todo list
    const createTodoListResult = await meApi.createTodoList()
        .setBody({
            title : "My First Todo List",
        })
        .send()
        .then((result) => {
            return result.responseBody;
        });
    t.deepEqual(createTodoListResult, {
        todoListId : BigInt(1),
        title : "My First Todo List",
        items : [],
    });

    //Create item
    const createItemResult = await meApi.createItem()
        .setParam(createTodoListResult)
        .setBody({
            name : "Buy Fruits",
            description : "Vitamin C is important",
        })
        .send()
        .then((result) => {
            return result.responseBody;
        });
    t.deepEqual(createItemResult, {
        itemId : BigInt(1),
        name : "Buy Fruits",
        description : "Vitamin C is important",
        done : false,
    });

    //Update item
    const updateItemResult = await meApi.updateItem()
        .setParam({
            todoListId : createTodoListResult.todoListId,
            itemId : createItemResult.itemId,
        })
        .setBody({
            done : true,
        })
        .send()
        .then((result) => {
            return result.responseBody;
        });
    t.deepEqual(updateItemResult, {
        itemId : BigInt(1),
        name : "Buy Fruits",
        description : "Vitamin C is important",
        done : true,
    });

    //Fetch todo list
    const fetchTodoListResult = await meApi.fetchTodoList()
        .setParam(createTodoListResult)
        .send()
        .then((result) => {
            return result.responseBody;
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
    const fetchItemResult = await meApi.fetchItem()
        .setParam({
            todoListId : createTodoListResult.todoListId,
            itemId : createItemResult.itemId,
        })
        .send()
        .then((result) => {
            return result.responseBody;
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