import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .asyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals.isRequiredLocals
    });