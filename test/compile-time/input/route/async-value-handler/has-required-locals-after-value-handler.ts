import * as express from "../../../../../dist";

export const route = express.app()
    .asyncValueHandler<{ isRequiredLocals : true }>(async () => {
        return {
            isRequiredLocals : true,
        };
    })
    .createRouter()
    .createRoute(
        (require("route-declaration") as typeof import("route-declaration")).route()
    )
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