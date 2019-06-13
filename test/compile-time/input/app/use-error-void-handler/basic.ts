import * as express from "../../../../../dist";

export const app = express.app()
    .errorVoidHandler((err, req, res, next) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        next();
    });