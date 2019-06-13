import * as express from "../../../../../dist";

export const router = express.router()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .errorValueHandler<{
        test : 2
    }>((_err, req, res, next) => {
        req.params
        res.locals.inLocals
        next.success({
            test : 2
        });
    });