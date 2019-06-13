import * as express from "../../../../../dist";

export const router = express.router()
    .asyncVoidHandler((req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    });