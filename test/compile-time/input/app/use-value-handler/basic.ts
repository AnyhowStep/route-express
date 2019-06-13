import * as express from "../../../../../dist";

export const app = express.app()
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    });