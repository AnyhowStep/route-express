import * as express from "../../../../../dist";

export const router = express.router()
    .errorValueHandler((err, req, res, next, tooMany) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        tooMany;
        next();
    });