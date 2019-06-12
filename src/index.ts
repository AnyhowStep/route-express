export * from "./app";
export * from "./async-value-handler";
export * from "./async-void-handler";
export * from "./route";
export * from "./route-declaration-util";
export * from "./router";
export * from "./value-handler";
export * from "./void-handler";
export * from "./locals";
export * from "./request";
export * from "./response";
/*
import * as tm from "type-mapping";
import * as rd from "route-declaration";
import {router} from "./router";
import {app as a} from "./app";
rd.tryPolyfillBigIntToJson();

const app = a<{ required : true }>();
const decl = rd.route()
    .setMethod("POST")
    .appendParam("helloId")
    .setParam(tm.object({
        helloId : tm.mysql.bigIntUnsigned(),
    }))
    .setQuery(tm.object({
        page : tm.mysql.bigIntUnsigned(),
    }))
    .setHeader(tm.renameMap({
        cultid : tm.mysql.bigIntUnsigned().withName("cultId"),
    }))
    .setBody(tm.object({
        helloCount : tm.mysql.bigIntUnsigned(),
    }))
    .setResponse(tm.object({
        nextHello : tm.mysql.bigIntUnsigned(),
    }));
const r = router();
r.voidHandler((_req, _res, next) => {
    console.log("use called");
    next();
});
r.add(decl)
    .voidHandler((req, res, next) => {
        console.log(req.params);
        console.log(req.query);
        console.log(req.headers);
        console.log(req.body);
        res.json({
            nextHello : BigInt(5),
        });
        next();
    })
    .voidHandler((_req, _res, _next) => {
        console.log("CHAIN! Throwing error");
        throw new Error("Thrown");
        //next();
    })
    .voidHandler((_req, _res, next) => {
        console.log("CHAIN2! - Should Skip");
        next();
    })
    .errorVoidHandler((err, _req, _res, next) => {
        console.log("Encountered error", err);
        next();
    })
    .voidHandler((_req, _res, next) => {
        console.log("CHAIN3!");
        next();
    })
    .voidHandler((_req, _res, next) => {
        console.log("CHAIN4! Throwing error");
        next(new Error("Thrown4"));
    })
    .voidHandler((_req, _res, next) => {
        console.log("CHAIN5! - Should Skip");
        next();
    })
    .errorValueHandler<{ test : 4 }>((err, _req, _res, next) => {
        console.log("Encountered error", err);
        next.success({
            test : 4
        });
    })
    .voidHandler((_req, res, next) => {
        console.log("CHAIN6!", res.locals);
        next();
    })
    .valueHandler<{ test : 4, test2 : 7 }>((_req, _res, next) => {
        console.log("CHAIN7! Locals");
        next.success({
            test : 4,
            test2 : 7,
        });
    })
    .voidHandler((_req, res, next) => {
        console.log("CHAIN8!" + new Date().getTime(), res.locals);
        next();
    })
    .asyncVoidHandler(() => {
        console.log("CHAIN9!" + new Date().getTime());
        const result = new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log("CHAIN9 - 1 second later!");
                resolve();
            }, 1000);
        });
        console.log("CHAIN9 - promise created");
        return result;
    })
    .asyncVoidHandler(() => {
        console.log("CHAIN10!")
        const result = new Promise<void>((resolve) => {
            setTimeout(() => {
                console.log("CHAIN10 - 1 second later!");
                resolve();
            }, 1000);
        });
        console.log("CHAIN10 - promise created");
        return result;
    })
    .asyncValueHandler(() => {
        console.log("CHAIN11! value")
        const result = new Promise<{ asyncValueHandler : true }>((resolve) => {
            setTimeout(() => {
                console.log("CHAIN11 - 1 second later!");
                resolve({
                    asyncValueHandler : true,
                });
            }, 1000);
        });
        console.log("CHAIN11 - promise created");
        return result;
    })
    .asyncValueHandler(async () => {
        console.log("CHAIN12! value");
        return {
            async12 : true,
        } as const;
    })
    .voidHandler((_req, res, next) => {
        console.log("CHAIN13!", res.locals);
        next();
    });

//Adding a duplicate implementation
r.add(decl)
    .voidHandler((req, res, next) => {
        console.log(req.params);
        console.log(req.query);
        console.log(req.headers);
        console.log(req.body);
        res.json({
            nextHello : BigInt(5),
        });
        next();
    });
r.voidHandler((_req, _res, next) => {
    console.log("use2 called");
    next();
});
//const e : expressCore.IRouter = r;
app.use("/hello", r);
const r2 = router();
r2.voidHandler((_req, _res, next) => {
    console.log("use3 called");
    next();
});
app.use(r2);
const r3 = router();
r3.voidHandler((_req, _res, next) => {
    console.log("use4 called");
    next();
});
app.use("/hello2", r3);
app.use(r3);
const app2 = a();
app2.use(app);
import * as http from "http";
import * as client from "route-client";
http.createServer(app).listen(9898, () => {
    console.log("server started");
    client.request(decl, new client.AxiosSender({
        domain : "http://localhost:9898/hello"
    })).setParam({
        helloId : BigInt(1),
    }).setQuery({
        page : BigInt(2),
    }).setHeader({
        cultId : BigInt(3),
    }).setBody({
        helloCount : BigInt(4),
    })
    .send()
    .then(({responseBody}) => {
        console.log(responseBody);
    })
})
//*/