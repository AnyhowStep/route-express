import * as tape from "tape";
import * as http from "http";
import * as axios from "axios";
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
    fetch : route()
        .append("/flower")
        .appendParam("flowerId", /\d+/)
        .setParam(tm.object(
            fields.flowerId
        ))
        .setResponse(flower),
});
tape(__filename, async (t) => {
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const app = express.app();
        app.createRoute(FlowerApi.routes.fetch)
            .voidHandler((req, res) => {
                res.json({
                    flowerId : req.params.flowerId,
                    name : "Rose",
                    wateredAt : new Date(),
                });
            });
        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
    });

    const result = await flowerApi.fetch()
        .setParam({
            flowerId : BigInt(4),
        })
        .send();
    t.deepEqual(result.sendConfig.method, "GET");
    t.deepEqual(result.sendConfig.path, "/flower/4");
    t.deepEqual(result.sendConfig.query, undefined);
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
    t.deepEqual(result.responseBody.flowerId, BigInt(4));
    t.deepEqual(result.responseBody.name, "Rose");
    t.true(result.responseBody.wateredAt instanceof Date);
    t.true(result.responseHeader instanceof Object);

    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});