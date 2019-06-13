import * as express from "../../../../../dist";

export const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .useAsyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals.inLocals
    });