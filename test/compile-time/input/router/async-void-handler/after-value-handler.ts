import * as express from "../../../../../dist";

export const router = express.router()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals.inLocals
    });