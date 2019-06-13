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
const FlowerApi = toAxiosApi({
    delete : route()
        .setMethod("DELETE")
        .append("/flower")
        .appendParam("flowerId", /\d+/)
        .setParam(tm.object(
            fields.flowerId
        )),
});
tape(__filename, async (t) => {
    const port = 9742;
    const server = await new Promise<http.Server>((resolve) => {
        const app = express.app();
        app.createRoute(FlowerApi.routes.delete)
            .voidHandler((req, res) => {
                if (req.params.flowerId == BigInt(404)) {
                    res.status(404).end();
                } else {
                    res.status(204).end();
                }
            });
        const server = http.createServer(app).listen(port, () => {
            resolve(server);
        });
    });

    const flowerApi = new FlowerApi({
        domain : `http://localhost:${port}`,
    });

    const result = await flowerApi.delete()
        .setParam({
            flowerId : BigInt(4),
        })
        .send();
    t.deepEqual(result.sendConfig.method, "DELETE");
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
        204
    );
    t.deepEqual(
        (result.responseImpl as axios.AxiosResponse<unknown>).statusText,
        "No Content"
    );
    t.true(
        (result.responseImpl as axios.AxiosResponse<unknown>).config instanceof Object
    );
    t.true(
        (result.responseImpl as axios.AxiosResponse<unknown>).headers instanceof Object
    );
    t.deepEqual(
        (result.responseImpl as axios.AxiosResponse<unknown>).data,
        ""
    );
    t.deepEqual(result.status, 204);
    t.deepEqual(result.statusText, "No Content");
    t.deepEqual(result.responseBody, undefined);
    t.true(result.responseHeader instanceof Object);

    {
        const result = await flowerApi.delete()
            .setParam({
                flowerId : BigInt(404),
            })
            .on(404, () => {
                return {
                    notFound : true,
                };
            })
            .send();
        if (result.status == 404) {
            t.deepEqual(result.responseBody.notFound, true);
        } else {
            t.fail("Expected 404 status");
        }
    }

    await new Promise((resolve) => {
        server.close(resolve);
    });

    t.end();
});