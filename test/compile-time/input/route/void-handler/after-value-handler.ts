import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .voidHandler((req, res, next) => {
        req.params
        res.locals.inLocals
        next();
    });