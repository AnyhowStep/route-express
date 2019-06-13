import * as express from "../../../../../dist";

export const router = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .asyncValueHandler<{ test : 2 }>(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
        return {
            test : 2
        };
    });