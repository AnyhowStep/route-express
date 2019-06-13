import * as express from "../../../../../dist";

export const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .useAsyncVoidHandler(async (req, res) => {
        req.params
        res.locals.inLocals
    });