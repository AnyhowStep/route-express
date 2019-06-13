import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .voidHandler((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next();
    });