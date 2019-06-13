import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .useAsyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .useAsyncVoidHandler((req, res) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        return Promise.resolve();
    });