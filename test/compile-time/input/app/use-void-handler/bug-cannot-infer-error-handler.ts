import * as express from "../../../../../dist";

export const app = express.app()
    //https://github.com/microsoft/TypeScript/issues/31867
    .useVoidHandler((err, req, res, next) => {
        err;
        req.params
        res.locals
        next();
    });