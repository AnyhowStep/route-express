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
    .asyncValueHandler<{ test : 2 }>(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
        return {
            test : 2
        };
    });