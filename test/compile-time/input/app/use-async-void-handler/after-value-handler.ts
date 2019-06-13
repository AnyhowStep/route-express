import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals.inLocals
    });