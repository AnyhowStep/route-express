import * as express from "../../../../../dist";

export const router = express.router()
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    });