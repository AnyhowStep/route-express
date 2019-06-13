import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncErrorValueHandler<{
        test : 2
    }>(async (_err, req, res) => {
        req.params
        res.locals.inLocals
        return {
            test : 2
        };
    });