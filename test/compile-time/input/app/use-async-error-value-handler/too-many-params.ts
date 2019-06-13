import * as express from "../../../../../dist";

export const app = express.app()
    .asyncErrorValueHandler((err, req, res, tooMany) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        res.locals
        tooMany;
    });