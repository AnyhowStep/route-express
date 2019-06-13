import * as express from "../../../../../dist";

export const app = express.app()
    .useVoidHandler((req, res, next) => {
        req.params
        res.locals
        next();
        return 1;
    });