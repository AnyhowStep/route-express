import * as tm from "type-mapping/fluent";
import * as rd from "route-declaration";
import * as express from "../../../../../dist";

export const route = express.route(
        rd.route()
            .append("/space")
            .appendParam("spaceId", /space_\d+/)
            .setParam(tm.object({
                spaceId : tm.match(/^space_\d+$/),
            }))
            .setQuery(tm.object({
                format : tm.literal("json", "xml").optional()
            }))
            .setBody(tm.object({
                time : tm.mysql.dateTime(3),
            }))
            .setHeader(tm.object({
                distortion : tm.mysql.varChar(1,255),
            }))
            .setResponse(tm.object({
                spaceId : tm.match(/^space_\d+$/),
                time : tm.mysql.dateTime(3),
            })),
        null as any,
        null as any
    )
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    });