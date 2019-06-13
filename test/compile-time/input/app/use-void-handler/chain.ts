import * as express from "../../../../../dist";

export const app = express.app()
    .voidHandler((req, res, next) => {
        req.params
        res.locals
        next();
    })
    .voidHandler((req, res, next) => {
        req.params
        res.locals
        next();
    })
    .voidHandler((req, res, next) => {
        req.params
        res.locals
        next();
    });