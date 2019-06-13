import * as express from "../../../../../dist";

export const app = express.app()
    //https://github.com/microsoft/TypeScript/issues/31867
    .useAsyncVoidHandler((err, req, res) => {
        err;
        req.params
        res.locals
        return Promise.resolve();
    });