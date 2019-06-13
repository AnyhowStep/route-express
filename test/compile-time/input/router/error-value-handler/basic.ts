import * as express from "../../../../../dist";

export const router = express.router()
    .errorValueHandler<{ test : 2 }>((_err, req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    });