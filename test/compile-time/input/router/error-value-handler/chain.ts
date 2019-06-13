import * as express from "../../../../../dist";

/*
    Note to self, delete all errorXxxHandler()
    The problem is that with these "dual" (request and error) handler paths,

    there is a good chance of some being skipped and never having run.
    This makes static analysis difficult/impossible.
*/

export const router = express.router()
    .errorValueHandler<{ test : 2 }>((_err, req, res, next) => {
        req.params
        res.locals
        next.success({
            test : 2
        });
    })
    .errorValueHandler<{ test2 : 3 }>((_err, req, res, next) => {
        req.params
        res.locals
        next.success({
            test2 : 3
        });
    })
    .errorValueHandler<{ test3 : 4 }>((_err, req, res, next) => {
        req.params
        res.locals
        next.success({
            test3 : 4
        });
    });