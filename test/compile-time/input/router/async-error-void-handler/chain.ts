import * as express from "../../../../../dist";

export const router = express.router()
    .asyncErrorVoidHandler((_err, req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    })
    .asyncErrorVoidHandler((_err, req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    })
    .asyncErrorVoidHandler((_err, req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    });