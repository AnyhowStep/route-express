import * as tm from "type-mapping/fluent";
import * as rd from "route-declaration";
import * as express from "../../../../../dist";

export const route = express.app()
    .asyncValueHandler(async () => {
        return {
            inApp : true,
        } as const;
    })
    .createRouter()
    .asyncValueHandler(async () => {
        return {
            inRouter : true,
        } as const;
    })
    .createRoute(rd.route()
        .setMethod("PUT")
        .append("/resource")
        .appendParam("resourceId", /\d+/)
        .setParam(tm.object({
            resourceId : tm.mysql.bigIntUnsigned(),
        }))
        .setQuery(tm.object({
            format : tm.literal("json", "xml").optional(),
        }))
        .setBody(tm.object({
            name : tm.mysql.varChar(1, 255).optional(),
        }))
        .setHeader(tm.object({
            "api-key" : tm.mysql.varChar(1, 255)
        }))
        .setResponse(tm.object({
            resourceId : tm.mysql.bigIntUnsigned(),
            name : tm.mysql.varChar(1, 255),
        }))
    );