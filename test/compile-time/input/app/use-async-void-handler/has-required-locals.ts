import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
    });