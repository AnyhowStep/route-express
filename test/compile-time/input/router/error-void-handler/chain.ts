import * as express from "../../../../../dist";

export const router = express.router()
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals
        next();
    })
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals
        next();
    })
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals
        next();
    });