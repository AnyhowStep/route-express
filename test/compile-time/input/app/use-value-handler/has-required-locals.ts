import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next.success({
            test : 2
        });
    });