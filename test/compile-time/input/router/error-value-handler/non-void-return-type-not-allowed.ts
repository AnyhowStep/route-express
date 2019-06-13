import * as express from "../../../../../dist";

export const router = express.router()
    .errorValueHandler<{ test : number }>((_err, req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 1
        });
        return 1;
    });