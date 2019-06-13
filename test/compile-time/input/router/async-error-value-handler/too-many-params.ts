import * as express from "../../../../../dist";

export const router = express.router()
    .asyncErrorValueHandler((err, req, res, tooMany) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        tooMany;
    });