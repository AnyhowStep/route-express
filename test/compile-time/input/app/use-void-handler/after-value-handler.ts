import * as express from "../../../../../dist";

export const app = express.app()
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