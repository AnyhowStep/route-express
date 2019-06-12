import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .useAsyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .useVoidHandler((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next();
    });