import * as rd from "route-declaration";
import * as express from "express";
import * as expressCore from "express-serve-static-core";
import * as handler from "../handler-lib";
import {
    RequestVoidHandler,
    ErrorVoidHandler,
    VoidHandler,
} from "../void-handler";
import {
    ErrorValueHandler,
    RequestValueHandler,
    ValueHandler,
    ValueHandlerUtil,
    isRequestValueHandler,
} from "../value-handler";
import {
    AsyncRequestVoidHandler,
    AsyncErrorVoidHandler,
    AsyncVoidHandler,
    AsyncVoidHandlerUtil,
    isAsyncRequestVoidHandler
} from "../async-void-handler";
import {
    AsyncRequestValueHandler,
    AsyncErrorValueHandler,
    AsyncValueHandler,
    AsyncValueHandlerUtil,
    isAsyncRequestValueHandler
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
export class Route<DataT extends RouteData> implements IRoute<DataT> {
    private routerHandler : expressCore.IRouterHandler<expressCore.IRoute>;

    voidHandler (handler : RequestVoidHandler<DataT>) : Route<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorVoidHandler()` until the above is fixed.
    */
    voidHandler (handler : ErrorVoidHandler<DataT>) : Route<DataT>;
    //voidHandler (handler : VoidHandler<DataT>) : Route<DataT>;
    voidHandler (handler : VoidHandler<DataT>) : Route<DataT> {
        this.routerHandler(handler);
        return this;
    }

    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `voidHandler()`
    */
    errorVoidHandler (handler : ErrorVoidHandler<DataT>) : Route<DataT> {
        this.routerHandler((
            (err, req, res, next) => {
                return handler(err, req, res, next);
            }
        ) as expressCore.ErrorRequestHandler);
        return this;
    }

    valueHandler<NextLocalsT extends Locals> (handler : RequestValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorValueHandler()` until the above is fixed.
    */
    valueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    );
    valueHandler<NextLocalsT extends Locals> (handler : ValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    ) {
        if (isRequestValueHandler(handler)) {
            this.routerHandler(ValueHandlerUtil.toRequestVoidHandler<any>(handler));
        } else {
            this.routerHandler(ValueHandlerUtil.toErrorVoidHandler<any>(handler));
        }
        return this;
    }
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `valueHandler()`
    */
    errorValueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
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
        this.routerHandler(ValueHandlerUtil.toErrorVoidHandler<any>(handler));
        return this;
    }

    asyncVoidHandler (handler : AsyncRequestVoidHandler<DataT>) : Route<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorVoidHandler()` until the above is fixed.
    */
    asyncVoidHandler (handler : AsyncErrorVoidHandler<DataT>) : Route<DataT>;
    asyncVoidHandler (handler : AsyncVoidHandler<DataT>) : Route<DataT> {
        if (isAsyncRequestVoidHandler(handler)) {
            this.routerHandler(AsyncVoidHandlerUtil.toRequestVoidHandler<any>(handler));
        } else {
            this.routerHandler(AsyncVoidHandlerUtil.toErrorVoidHandler<any>(handler));
        }
        return this;
    }

    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `asyncVoidHandler()`
    */
    asyncErrorVoidHandler (handler : AsyncErrorVoidHandler<DataT>) : Route<DataT> {
        this.routerHandler(AsyncVoidHandlerUtil.toErrorVoidHandler<any>(handler));
        return this;
    }

    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncRequestValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorValueHandler()` until the above is fixed.
    */
    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    );
    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
                locals : (
                    & DataT["response"]["locals"]
                    & NextLocalsT
                ),
                json : DataT["response"]["json"],
            }
        }>
    ) {
        if (isAsyncRequestValueHandler(handler)) {
            this.routerHandler(AsyncValueHandlerUtil.toRequestVoidHandler<any>(handler));
        } else {
            this.routerHandler(AsyncValueHandlerUtil.toErrorVoidHandler<any>(handler));
        }
        return this;
    }
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `asyncValueHandler()`
    */
    asyncErrorValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<DataT, NextLocalsT>) : (
        Route<{
            readonly request : DataT["request"],
            readonly response : {
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
        this.routerHandler(AsyncValueHandlerUtil.toErrorVoidHandler<any>(handler));
        return this;
    }

    constructor (args : RouteArgs) {
        const headerMapper = args.routeDeclaration.header;
        const method = rd.RouteUtil.getMethod(args.routeDeclaration);
        const fullName = `${method} ${args.routeDeclaration.path.routerPath}`;

        const expressRoute = args.expressRouter.route(args.routeDeclaration.path.routerPath);
        this.routerHandler = getRouterHandler(expressRoute, method);
        /*
            These handlers will invoke the mappers of the
            route declaration before running any other handlers.

            Every time we call `this.routerHandler()`,
            the state of the `expressRoute` object changes.
        */
        this.routerHandler(
            (req, res, next) => {
                if (res.headersSent) {
                    console.warn(`Headers already sent for: ${req.method} ${req.path}. Skipping route handlers for: ${fullName}`);
                    return;
                } else {
                    next();
                }
            },
            //We want to parse JSON body
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