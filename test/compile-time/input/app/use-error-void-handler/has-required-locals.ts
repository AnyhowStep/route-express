import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .errorVoidHandler((_err, req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next();
    });