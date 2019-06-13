import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .voidHandler((req, res, next) => {
        req.params
        res.locals
        next();
    });