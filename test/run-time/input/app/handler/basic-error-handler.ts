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
                calls.push("From 1");
                next(new Error(`From 1`));
            }).voidHandler((_req, _res, next) => {
                t.fail("Should not call me 2")
                next();
            }).valueHandler<{ four : "4" }>((_req, _res, next) => {
                t.fail("Should not call me")
                next.success({
                    four : "4"
                });
            }).asyncErrorVoidHandler(async (err, _req, res) => {
                t.deepEqual(res.locals, {});
                t.deepEqual(err.message, `From 1`);
                calls.push("Catch 1");
            })
        const router = app.createRouter("/router")
            .asyncVoidHandler(async () => {
                calls.push("From router");
                throw new Error(`From router`);
            })
            .asyncVoidHandler(async () => {
                t.fail("Should not call me");
            })
            .errorVoidHandler((err, _req, _res, next) => {
                t.deepEqual(err.message, `From router`);
                calls.push("Catch router");
                next();
            });

        router.createRoute(FlowerApi.routes.fetch)
            .voidHandler((req, res, next) => {
                calls.push("route");
                res.json({
                    flowerId : req.params.flowerId,
                    name : "Rose",
                    wateredAt : new Date(),
                });
                next();
            });

        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
        root : "/router",
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

    t.deepEqual(result.responseBody.flowerId, BigInt(4));
    t.deepEqual(result.responseBody.name, "Rose");
    t.true(result.responseBody.wateredAt instanceof Date);

    t.deepEqual(
        calls,
        [
            "From 1",
            "Catch 1",
            "From router",
            "Catch router",
            "route",
        ]
    );

    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});