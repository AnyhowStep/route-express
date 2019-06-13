import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next();
    });