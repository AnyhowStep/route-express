import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createSubApp()
    .asyncValueHandler(async () => {
        return {
            inLocals : true,
        } as const;
    })
    .asyncValueHandler<{ test : 2 }>(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        return {
            test : 2
        };
    });