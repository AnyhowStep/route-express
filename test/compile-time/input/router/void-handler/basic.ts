import * as express from "../../../../../dist";

export const router = express.router()
    .voidHandler((req, res, next) => {
        req.params
        res.locals
        next();
    });