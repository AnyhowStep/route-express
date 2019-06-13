import * as express from "../../../../../dist";

/*
    Note to self, delete all errorXxxHandler()
    The problem is that with these "dual" (request and error) handler paths,

    there is a good chance of some being skipped and never having run.
    This makes static analysis difficult/impossible.
*/

export const router = express.router()
    .asyncErrorValueHandler(async (_err, req, res) => {
        req.params
        res.locals
        return {
            test : 2 as 2
        };
    })
    .asyncErrorValueHandler<{ test2 : 3 }>(async (_err, req, res) => {
        req.params
        res.locals
        return {
            test2 : 3
        };
    })
    .asyncErrorValueHandler<{ test3 : 4 }>(async (_err, req, res) => {
        req.params
        res.locals
        return {
            test3 : 4
        };
    });