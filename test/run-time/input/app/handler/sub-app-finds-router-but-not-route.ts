import * as tape from "tape";
import * as http from "http";
import * as tm from "type-mapping/fluent";
import {route} from "route-declaration";
import {toAxiosApi} from "route-client";
import * as express from "../../../../../dist";

const fields = tm.fields({
    flowerId : tm.mysql.bigIntUnsigned(),
    name : tm.mysql.varChar(),
    wateredAt : tm.mysql.dateTime(3),
});
const flower = tm.object(fields);
const FlowerApi = toAxiosApi({
    fetch : route()
        .append("/flower")
        .appendParam("flowerId", /\d+/)
        .setParam(tm.object(
            fields.flowerId
        ))
        .setResponse(flower),
});
tape(__filename, async (t) => {
    const calls : string[] = [];
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const app = express.app()
            .voidHandler((_req, _res, next) => {
                calls.push("1");
                next();
            }).voidHandler((_req, _res, next) => {
                calls.push("2");
                next();
            }).valueHandler<{ four : "4" }>((_req, _res, next) => {
                calls.push("3");
                next.success({
                    four : "4"
                });
            }).asyncVoidHandler(async (_req, res) => {
                calls.push(res.locals.four);
            }).asyncValueHandler(async () => {
                calls.push("5");
                return {
                    six : "6",
                };
            }).voidHandler((_req, res, next) => {
                t.deepEqual(res.locals, {
                    four : "4",
                    six : "6",
                });
                calls.push(res.locals.six);
                next();
            });
        app.use((_req, _res, next) => {
            calls.push("app.use() 1");
            next();
        });

        const subApp = app.createSubApp();
        const router = subApp.createRouter("/router")
            .asyncVoidHandler(async (_req, res) => {
                t.deepEqual(res.locals, {
                    four : "4",
                    six : "6",
                });
                calls.push("7");
            });

        app.use((_req, _res, next) => {
            calls.push("app.use() 2");
            next();
        });

        router.use((_req, _res, next) => {
            calls.push("router.use() 1");
            next();
        });

        router.createRoute(FlowerApi.routes.fetch)
            .voidHandler((req, res, next) => {
                calls.push("8");
                res.json({
                    flowerId : req.params.flowerId,
                    name : "Rose",
                    wateredAt : new Date(),
                });
                next();
            });

        app.use((_req, _res, next) => {
            calls.push("app.use() 3");
            next();
        });

        router.use((_req, _res, next) => {
            calls.push("router.use() 2");
            next();
        });

        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
        root : "/router/does-not-exist",
    });

    const result = await flowerApi.fetch()
        .setParam({
            flowerId : BigInt(4),
        })
        .on(404, () => {
            return {
                flowerId : BigInt(-1),
                name : "-",
                wateredAt : null,
            };
        })
        .send();

    t.deepEqual(result.responseBody.flowerId, BigInt(-1));
    t.deepEqual(result.responseBody.name, "-");
    t.deepEqual(result.responseBody.wateredAt, null);

    t.deepEqual(
        calls,
        [
            "app.use() 1",
            "router.use() 1",
            "router.use() 2",
            "app.use() 2",
            "app.use() 3",
        ]
    );

    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});