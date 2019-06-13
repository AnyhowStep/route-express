import * as express from "../../../../../dist";

export const router = express.router()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals.inLocals
        next();
    });