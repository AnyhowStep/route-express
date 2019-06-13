import * as express from "../../../../../dist";

export const app = express.app()
    .valueHandler<{ test : number }>((req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 1
        });
        return 1;
    });