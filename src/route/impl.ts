import * as rd from "route-declaration";
import * as express from "express";
import * as expressCore from "express-serve-static-core";
import * as handler from "../handler-lib";
import {
    VoidHandlerUtil,
    __RequestVoidHandler,
    __ErrorVoidHandler,
} from "../void-handler";
import {
    ValueHandlerUtil,
    __RequestValueHandler,
    __ErrorValueHandler,
} from "../value-handler";
import {
    AsyncVoidHandlerUtil,
    __AsyncRequestVoidHandler,
    __AsyncErrorVoidHandler
} from "../async-void-handler";
import {
    AsyncRequestValueHandler,
    AsyncErrorValueHandler,
    AsyncValueHandlerUtil,
} from "../async-value-handler";
import {RouteData, IRoute} from "./route";
import * as RouteDeclarationUtil from "../route-declaration-util";
import {Locals} from "../locals";

function getRouterHandler (
    route : expressCore.IRoute,
    method : Exclude<rd.MethodStr, "Contextual">
) : expressCore.IRouterHandler<expressCore.IRoute> {
    switch (method) {
        case "GET": {
            return route.get.bind(route);
        }
        case "POST": {
            return route.post.bind(route);
        }
        case "PUT": {
            return route.put.bind(route);
        }
        case "DELETE": {
            return route.delete.bind(route);
        }
        case "PATCH": {
            return route.patch.bind(route);
        }
        case "HEAD": {
            return route.head.bind(route);
        }
        case "OPTIONS": {
            return route.options.bind(route);
        }
        case "CONNECT": {
            //The .d.ts file is wrong.
            //This exists.
            return (route as any).connect.bind(route);
        }
        default: {
            throw new Error(`Method ${method} not supported`);
        }
    }
}
export interface RouteArgs {
    readonly routeDeclaration : rd.RouteData,
    readonly expressRouter : expressCore.IRouter
}
class Route<DataT extends RouteData> implements IRoute<DataT> {
    private expressRouterHandler : expressCore.IRouterHandler<expressCore.IRoute>;

    voidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    ) {
        this.expressRouterHandler(VoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return this;
    }
    errorVoidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    ) {
        this.expressRouterHandler(VoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return this;
    }

    valueHandler<
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestValueHandler<DataT, NextLocalsT, ReturnT>) : (
        IRoute<{
            request : DataT["request"],
            response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    ) {
        this.expressRouterHandler(ValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return this;
    }
    errorValueHandler<
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorValueHandler<DataT, NextLocalsT, ReturnT>) : (
        IRoute<{
            request : DataT["request"],
            response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                //Technically, this causes the wrong return type.
                //`ReturnType<DataT["response"]["json"]>`
                //should be `DataT["response"]["locals"] & NextLocalsT`
                //But is instead,
                //`DataT["response"]["locals"]`
                json : DataT["response"]["json"],
            }
        }>
    ) {
        this.expressRouterHandler(ValueHandlerUtil.toSafeErrorVoidHandler(handler));
        return this;
    }

    asyncVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    ) {
        this.expressRouterHandler(AsyncVoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return this;
    }
    asyncErrorVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    ) {
        this.expressRouterHandler(AsyncVoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return this;
    }

    asyncValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncRequestValueHandler<DataT, NextLocalsT>) : (
        IRoute<{
            request : DataT["request"],
            response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    ) {
        this.expressRouterHandler(AsyncValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return this;
    }
    asyncErrorValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncErrorValueHandler<DataT, NextLocalsT>) : (
        IRoute<{
            request : DataT["request"],
            response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    ) {
        this.expressRouterHandler(AsyncValueHandlerUtil.toSafeErrorVoidHandler<any>(handler));
        return this;
    }

    constructor (args : RouteArgs) {
        const headerMapper = args.routeDeclaration.header;
        const method = rd.RouteUtil.getMethod(args.routeDeclaration);
        const fullName = `${method} ${args.routeDeclaration.path.routerPath}`;

        const expressRoute = args.expressRouter.route(args.routeDeclaration.path.routerPath);
        this.expressRouterHandler = getRouterHandler(expressRoute, method);
        /*
            These handlers will invoke the mappers of the
            route declaration before running any other handlers.

            Every time we call `this.routerHandler()`,
            the state of the `expressRoute` object changes.
        */
        this.expressRouterHandler(
            (req, res, next) => {
                if (res.headersSent) {
                    console.warn(`Headers already sent for: ${req.method} ${req.path}. Skipping route handlers for: ${fullName}`);
                    return;
                } else {
                    next();
                }
            },
            //We want to parse JSON body, if it hasn't already been parsed
            express.json(),
            handler.responseMapper(
                (args.routeDeclaration.response == undefined) ?
                    () => undefined :
                    args.routeDeclaration.response,
                `${fullName} response`
            ),
            handler.mapper(
                (args.routeDeclaration.param == undefined) ?
                    () => ({}) :
                    args.routeDeclaration.param,
                (req) => {
                    return {
                        name : `${fullName} parameter`,
                        value : req.params
                    };
                },
                (req, _res, value) => {
                    req.params = value;
                }
            ),
            handler.mapper(
                (args.routeDeclaration.query == undefined) ?
                    () => ({}) :
                    args.routeDeclaration.query,
                (req) => {
                    return {
                        name : `${fullName} query`,
                        value : req.query
                    };
                },
                (req, _res, value) => {
                    req.query = value;
                }
            ),
            handler.mapper(
                (args.routeDeclaration.body == undefined) ?
                    () => ({}) :
                    args.routeDeclaration.body,
                (req) => {
                    return {
                        name : `${fullName} body`,
                        value : req.body
                    };
                },
                (req, _res, value) => {
                    req.body = value;
                }
            ),
            handler.mapper(
                (headerMapper == undefined) ?
                    (_name : string, mixed : unknown) => {
                        return mixed;
                    } :
                    (name : string, mixed : unknown) => {
                        //Note that header keys become lowercase.
                        //`Api-Key` becomes `api-key`.
                        //`ApiKey` becomes `apikey`.
                        //You might want a `rename<>()` mapper.
                        //`rename("api-key", "apiKey", f)`
                        const clean = headerMapper(name, mixed);
                        //When running the assertion,
                        //fields not checked are removed.
                        //But we want the unchecked headers
                        //to remain; they'll just be strings
                        return {
                            ...mixed,
                            ...clean,
                        };
                    },
                (req) => {
                    return {
                        name : `${fullName} header`,
                        value : req.headers
                    };
                },
                (req, _res, value) => {
                    req.headers = value as any;
                }
            ),
        );
    }
}

export function route<RouteDeclarationT extends rd.RouteData> (
    routeDeclaration : RouteDeclarationT,
    expressRouter : expressCore.IRouter
) : (
    IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, {}>>
) {
    return new Route<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, {}>>({
        routeDeclaration,
        expressRouter,
    });
}
/*
function getRouterMatcher (
    router : expressCore.IRouter,
    method : Exclude<rd.MethodStr, "Contextual">
) : expressCore.IRouterMatcher<expressCore.IRouter> {
    switch (method) {
        case "GET": {
            return router.get.bind(router);
        }
        case "POST": {
            return router.post.bind(router);
        }
        case "PUT": {
            return router.put.bind(router);
        }
        case "DELETE": {
            return router.delete.bind(router);
        }
        case "PATCH": {
            return router.patch.bind(router);
        }
        case "HEAD": {
            return router.head.bind(router);
        }
        case "OPTIONS": {
            return router.options.bind(router);
        }
        case "CONNECT": {
            return router.connect.bind(router);
        }
        default: {
            throw new Error(`Method ${method} not supported`);
        }
    }
}
*/