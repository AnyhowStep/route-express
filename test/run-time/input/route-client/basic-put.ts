import * as http from "http";
import * as axios from "axios";
import * as tape from "tape";
import * as tm from "type-mapping/fluent";
import {route} from "route-declaration";
import {toAxiosApi} from "route-client";
import * as express from "../../../../dist";

const fields = tm.fields({
    flowerId : tm.mysql.bigIntUnsigned(),
    name : tm.mysql.varChar(),
    wateredAt : tm.mysql.dateTime(3),
});
const flower = tm.object(fields);
const FlowerApi = toAxiosApi({
    update : route()
        .setMethod("PUT")
        .append("/flower")
        .appendParam("flowerId", /\d+/)
        .setParam(tm.object(
            fields.flowerId,
        ))
        .setBody(tm.object(
            fields.name.optional(),
            fields.wateredAt.optional(),
        ))
        .setResponse(flower),
});
tape(__filename, async (t) => {
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const app = express.app();
        app.createRoute(FlowerApi.routes.update)
            .voidHandler((req, res) => {
                if (req.params.flowerId == BigInt(304)) {
                    res.status(304).end();
                    return;
                }
                res.setHeader("hello", "world");
                res.json({
                    flowerId : req.params.flowerId,
                    name : (req.body.name == undefined) ?
                        "Not updated" :
                        req.body.name,
                    wateredAt : (req.body.wateredAt == undefined) ?
                        new Date("2001-01-01") :
                        req.body.wateredAt,
                });
            })
        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
    });

    {
        const result = await flowerApi.update()
            .setParam({
                flowerId : BigInt(88),
            })
            .setBody({
                name : "Orchid",
                wateredAt : new Date("2010-01-01"),
            })
            .send();
        t.deepEqual(result.sendConfig.method, "PUT");
        t.deepEqual(result.sendConfig.path, "/flower/88");
        t.deepEqual(result.sendConfig.query, undefined);
        t.deepEqual(result.sendConfig.body, {
            name : "Orchid",
            wateredAt : new Date("2010-01-01"),
        });
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(result.code, undefined);
        t.deepEqual(result.err, undefined);
        t.deepEqual(
            (result.responseImpl as axios.AxiosResponse<unknown>).config,
            result.configImpl
        );
        t.deepEqual(
            (result.responseImpl as axios.AxiosResponse<unknown>).request,
            result.requestImpl
        );
        t.true(
            (result.responseImpl as axios.AxiosResponse<unknown>).request instanceof Object
        );
        t.deepEqual(
            (result.responseImpl as axios.AxiosResponse<unknown>).status,
            200
        );
        t.deepEqual(
            (result.responseImpl as axios.AxiosResponse<unknown>).statusText,
            "OK"
        );
        t.true(
            (result.responseImpl as axios.AxiosResponse<unknown>).config instanceof Object
        );
        t.true(
            (result.responseImpl as axios.AxiosResponse<unknown>).headers instanceof Object
        );
        t.true(
            (result.responseImpl as axios.AxiosResponse<unknown>).data instanceof Object
        );
        t.deepEqual(result.status, 200);
        t.deepEqual(result.statusText, "OK");
        t.deepEqual(
            result.responseBody,
            {
                flowerId : BigInt(88),
                name : "Orchid",
                wateredAt : new Date("2010-01-01"),
            }
        )
        t.true(result.responseHeader instanceof Object);
        t.deepEqual(result.responseHeader.hello, "world");
    }

    {
        const result = await flowerApi.update()
            .setParam({
                flowerId : BigInt(77),
            })
            .setBody({
                wateredAt : new Date("2010-01-01"),
            })
            .send();
        t.deepEqual(result.sendConfig.method, "PUT");
        t.deepEqual(result.sendConfig.path, "/flower/77");
        t.deepEqual(result.sendConfig.query, undefined);
        t.deepEqual(result.sendConfig.body, {
            name : undefined,
            wateredAt : new Date("2010-01-01"),
        });
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(
            result.responseBody,
            {
                flowerId : BigInt(77),
                name : "Not updated",
                wateredAt : new Date("2010-01-01"),
            }
        )
    }

    {
        const result = await flowerApi.update()
            .setParam({
                flowerId : BigInt(23),
            })
            .setBody({
                name : "Rafflesia"
            })
            .send();
        t.deepEqual(result.sendConfig.method, "PUT");
        t.deepEqual(result.sendConfig.path, "/flower/23");
        t.deepEqual(result.sendConfig.query, undefined);
        t.deepEqual(result.sendConfig.body, {
            name : "Rafflesia",
            wateredAt : undefined,
        });
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(
            result.responseBody,
            {
                flowerId : BigInt(23),
                name : "Rafflesia",
                wateredAt : new Date("2001-01-01"),
            }
        )
    }

    {
        const result = await flowerApi.update()
            .setParam({
                flowerId : BigInt(57),
            })
            .setBody({
            })
            .send();
        t.deepEqual(result.sendConfig.method, "PUT");
        t.deepEqual(result.sendConfig.path, "/flower/57");
        t.deepEqual(result.sendConfig.query, undefined);
        t.deepEqual(result.sendConfig.body, {
            name : undefined,
            wateredAt : undefined,
        });
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(
            result.responseBody,
            {
                flowerId : BigInt(57),
                name : "Not updated",
                wateredAt : new Date("2001-01-01"),
            }
        )
    }

    {
        const result = await flowerApi.update()
            .setParam({
                flowerId : BigInt(304),
            })
            .setBody({
            })
            .on(304, () => {
                return {
                    notModified : true
                } as const;
            })
            .send();
        t.deepEqual(result.sendConfig.method, "PUT");
        t.deepEqual(result.sendConfig.path, "/flower/304");
        t.deepEqual(result.sendConfig.query, undefined);
        t.deepEqual(result.sendConfig.body, {
            name : undefined,
            wateredAt : undefined,
        });
        t.deepEqual(result.sendConfig.header, {});
        if (result.status == 304) {
            t.deepEqual(
                result.responseBody.notModified,
                true
            )
        } else {
            t.fail("Expected 304 status");
        }
    }


    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});