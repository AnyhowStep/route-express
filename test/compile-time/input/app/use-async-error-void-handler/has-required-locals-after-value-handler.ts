import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncErrorVoidHandler((_err, req, res) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        return Promise.resolve();
    });