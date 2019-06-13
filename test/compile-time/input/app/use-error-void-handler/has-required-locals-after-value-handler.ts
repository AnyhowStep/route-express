import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next();
    });