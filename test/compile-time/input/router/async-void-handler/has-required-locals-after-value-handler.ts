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
    .asyncVoidHandler((req, res) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        return Promise.resolve();
    });