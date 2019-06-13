import * as express from "../../../../../dist";

export const router = express.router()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncValueHandler<{
        test : 2
    }>(async (req, res) => {
        req.params
        res.locals.inLocals
        return {
            test : 2
        };
    });