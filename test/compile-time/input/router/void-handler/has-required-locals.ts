import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .voidHandler((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next();
    });