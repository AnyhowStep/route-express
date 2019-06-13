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
    .voidHandler((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        next();
    });