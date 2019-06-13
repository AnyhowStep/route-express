import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .errorValueHandler<{ test : 2 }>((_err, req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next.success({
            test : 2
        });
    });