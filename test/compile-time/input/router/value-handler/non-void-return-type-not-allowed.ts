import * as express from "../../../../../dist";

export const router = express.router()
    .valueHandler<{ test : number }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 1
        });
        return 1;
    });