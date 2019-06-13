import * as express from "../../../../../dist";

export const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .useErrorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals.inLocals
        next();
    });