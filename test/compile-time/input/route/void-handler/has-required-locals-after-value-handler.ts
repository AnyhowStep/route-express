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
    .voidHandler((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next();
    });