import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .asyncValueHandler(async (req, res) => {
        req.params
        res.locals
        return {
            test : 2 as 2
        };
    })
    .asyncValueHandler<{ test2 : 3 }>(async (req, res) => {
        req.params
        res.locals
        return {
            test2 : 3
        };
    })
    .asyncValueHandler<{ test3 : 4 }>(async (req, res) => {
        req.params
        res.locals
        return {
            test3 : 4
        };
    });