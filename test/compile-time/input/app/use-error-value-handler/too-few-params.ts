import * as express from "../../../../../dist";

export const app = express.app()
    //Should *always* be converted into an express error handler,
    //Even if we have too few params.
    .errorValueHandler((err, req, res) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        //next();
    });