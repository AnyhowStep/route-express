import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .errorValueHandler<{ test : 2 }>((_err, req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next.success({
            test : 2
        });
    });