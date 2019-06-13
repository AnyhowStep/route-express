import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .valueHandler<{
        test : 2
    }>((req, res, next) => {
        req.params
        res.locals.inLocals
        next.success({
            test : 2
        });
    });