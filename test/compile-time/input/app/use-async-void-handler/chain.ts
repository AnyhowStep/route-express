import * as express from "../../../../../dist";

export const app = express.app()
    .useAsyncVoidHandler((req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    })
    .useAsyncVoidHandler((req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    })
    .useAsyncVoidHandler((req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    });