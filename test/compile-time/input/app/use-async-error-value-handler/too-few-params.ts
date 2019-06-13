import * as express from "../../../../../dist";

export const app = express.app()
    //Should *always* be converted into an express error handler,
    //Even if we have too few params.
    .asyncErrorValueHandler(async (err, req) => {
        //Pretty sure it is of type `any`
        err = { lol : "lol" };
        console.log(err);
        req.params
        //next();
        throw new Error(``);
    });