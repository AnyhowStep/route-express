import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals.inLocals
    });