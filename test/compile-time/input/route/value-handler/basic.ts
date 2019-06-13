import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    });