import * as express from "../../../../../dist";

export const app = express.app()
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    })
    .valueHandler<{ test2 : 3 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test2 : 3
        });
    })
    .valueHandler<{ test3 : 4 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test3 : 4
        });
    });