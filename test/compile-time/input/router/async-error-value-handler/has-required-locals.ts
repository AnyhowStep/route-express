import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .asyncErrorValueHandler<{ test : 2 }>(async (_err, req, res) => {
        req.params
        res.locals.isRequiredLocals
        return {
            test : 2
        };
    });