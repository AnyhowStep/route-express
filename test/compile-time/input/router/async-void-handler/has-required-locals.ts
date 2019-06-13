import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
    });