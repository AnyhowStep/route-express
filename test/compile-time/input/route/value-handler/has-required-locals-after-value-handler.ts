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
    .valueHandler<{ test : 2 }>((req, res, next) => {
        req.params
        res.locals.isRequiredLocals
        res.locals.inLocals
        next.success({
            test : 2
        });
    });