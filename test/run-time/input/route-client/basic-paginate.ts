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
    paginate : route()
        .append("/flower")
        .setQuery(tm.object({
            page : tm.mysql.intUnsigned().optional(),
            rowsPerPage : tm.mysql.intUnsigned().optional(),
        }))
        .setResponse(tm.object({
            rows : flower.array(),
            optionalField : tm.string().optional(),
            requiredButMayBeUndefined : tm.string().orUndefined(),
            info : tm.object({
                page : tm.mysql.intUnsigned(),
                rowsPerPage : tm.mysql.intUnsigned(),
                rowsFound : tm.mysql.intUnsigned(),
                pagesFound : tm.mysql.intUnsigned(),
            }),
        })),
});
tape(__filename, async (t) => {
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const app = express.app();
        app.createRoute(FlowerApi.routes.paginate)
            .voidHandler((req, res) => {
                if (req.query.page == undefined) {
                    req.query.page = 17;
                }
                if (req.query.rowsPerPage == undefined) {
                    req.query.rowsPerPage = 32;
                }
                res.json({
                    rows : [
                        {
                            flowerId : BigInt(req.query.page+2),
                            name : "Flower " + (req.query.page+2),
                            wateredAt : new Date("2010-01-01 00:00:" + String(req.query.page+2).padStart(2, "0")),
                        },
                    ],
                    requiredButMayBeUndefined : undefined,
                    info : {
                        page : req.query.page,
                        rowsPerPage : req.query.rowsPerPage,
                        rowsFound : req.query.page*req.query.rowsPerPage,
                        pagesFound : req.query.page+1,
                    }
                });
            });
        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
    });

    const result = await flowerApi.paginate()
        .setQuery({
            page : 45,
            rowsPerPage : 50,
        })
        .send();
    t.deepEqual(result.sendConfig.method, "GET");
    t.deepEqual(result.sendConfig.path, "/flower");
    t.deepEqual(result.sendConfig.query, {
        page : 45,
        rowsPerPage : 50,
    });
    t.deepEqual(result.sendConfig.body, undefined);
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
    t.deepEqual(result.responseBody, {
        rows : [
            {
                flowerId : BigInt(47),
                name : "Flower 47",
                wateredAt : new Date("2010-01-01 00:00:47"),
            },
        ],
        optionalField : undefined,
        requiredButMayBeUndefined : undefined,
        info : {
            page : 45,
            rowsPerPage : 50,
            rowsFound : 45*50,
            pagesFound : 46,
        }
    });
    t.true(result.responseHeader instanceof Object);

    {
        const result = await flowerApi.paginate()
            .setQuery({
            })
            .on(304, () => {
                return {
                    notModified : true
                } as const;
            })
            .send();
        t.deepEqual(result.sendConfig.method, "GET");
        t.deepEqual(result.sendConfig.path, "/flower");
        t.deepEqual(result.sendConfig.query, {
            page : undefined,
            rowsPerPage : undefined,
        });
        t.deepEqual(result.sendConfig.body, undefined);
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(result.responseBody, {
            rows : [
                {
                    flowerId : BigInt(19),
                    name : "Flower 19",
                    wateredAt : new Date("2010-01-01 00:00:19"),
                },
            ],
            optionalField : undefined,
            requiredButMayBeUndefined : undefined,
            info : {
                page : 17,
                rowsPerPage : 32,
                rowsFound : 17*32,
                pagesFound : 18,
            }
        });
    }

    {
        const result = await flowerApi.paginate()
            .setQuery({
                page : 2,
            })
            .on(304, () => {
                return {
                    notModified : true
                } as const;
            })
            .send();
        t.deepEqual(result.sendConfig.method, "GET");
        t.deepEqual(result.sendConfig.path, "/flower");
        t.deepEqual(result.sendConfig.query, {
            page : 2,
            rowsPerPage : undefined,
        });
        t.deepEqual(result.sendConfig.body, undefined);
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(result.responseBody, {
            rows : [
                {
                    flowerId : BigInt(4),
                    name : "Flower 4",
                    wateredAt : new Date("2010-01-01 00:00:04"),
                },
            ],
            optionalField : undefined,
            requiredButMayBeUndefined : undefined,
            info : {
                page : 2,
                rowsPerPage : 32,
                rowsFound : 2*32,
                pagesFound : 3,
            }
        });
    }

    {
        const result = await flowerApi.paginate()
            .setQuery({
                rowsPerPage : 5,
            })
            .on(304, () => {
                return {
                    notModified : true
                } as const;
            })
            .send();
        t.deepEqual(result.sendConfig.method, "GET");
        t.deepEqual(result.sendConfig.path, "/flower");
        t.deepEqual(result.sendConfig.query, {
            page : undefined,
            rowsPerPage : 5,
        });
        t.deepEqual(result.sendConfig.body, undefined);
        t.deepEqual(result.sendConfig.header, {});
        t.deepEqual(result.responseBody, {
            rows : [
                {
                    flowerId : BigInt(19),
                    name : "Flower 19",
                    wateredAt : new Date("2010-01-01 00:00:19"),
                },
            ],
            optionalField : undefined,
            requiredButMayBeUndefined : undefined,
            info : {
                page : 17,
                rowsPerPage : 5,
                rowsFound : 17*5,
                pagesFound : 18,
            }
        });
    }

    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});