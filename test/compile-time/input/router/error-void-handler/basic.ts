import * as express from "../../../../../dist";

export const router = express.router()
    .errorVoidHandler((err, req, res, next) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        next();
    });