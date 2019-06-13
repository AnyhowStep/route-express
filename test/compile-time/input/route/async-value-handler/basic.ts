import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .asyncValueHandler<{ test : 2 }>(async (req, res) => {
        req.params
        res.locals
        return {
            test : 2
        };
    });