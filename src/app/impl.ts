import * as rd from "route-declaration";
import * as express from "express";
import {Locals} from "../locals";
import {__RequestValueHandler, __ErrorValueHandler, ValueHandlerUtil} from "../value-handler";
import {__RequestVoidHandler, __ErrorVoidHandler, VoidHandler, VoidHandlerUtil} from "../void-handler";
import {__AsyncRequestVoidHandler, __AsyncErrorVoidHandler, AsyncVoidHandlerUtil} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler, AsyncValueHandlerUtil} from "../async-value-handler";
import * as AppUtil from "./util";
import {IRouter, router} from "../router";
import {IRoute, route} from "../route";
import {IApp} from "./app";

/**
    Creates a new "main" app.
    Is backwards compatible with `expressCore.Express`.
*/
export function app () {
    const preRouteHandlers : VoidHandler<any>[] = [];
    const result = express() as unknown as IApp<{
        __hasParentApp : false,
        locals : {},
    }>;

    result.__hasParentApp = false;

    result.voidHandler = <
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<AppUtil.ToRequestRouteData<any>, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(VoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.errorVoidHandler = <
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<AppUtil.ToErrorRouteData<any>, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(VoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.valueHandler = <
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestValueHandler<AppUtil.ToRequestRouteData<any>, NextLocalsT, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(ValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.errorValueHandler = <
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorValueHandler<AppUtil.ToErrorRouteData<any>, NextLocalsT, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(ValueHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.asyncVoidHandler = <
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<AppUtil.ToRequestRouteData<any>, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(AsyncVoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.asyncErrorVoidHandler = <
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<AppUtil.ToErrorRouteData<any>, ReturnT>) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(AsyncVoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.asyncValueHandler = <NextLocalsT extends Locals> (
        handler : AsyncRequestValueHandler<AppUtil.ToRequestRouteData<any>, NextLocalsT>
    ) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(AsyncValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.asyncErrorValueHandler = <NextLocalsT extends Locals> (
        handler : AsyncErrorValueHandler<AppUtil.ToErrorRouteData<any>, NextLocalsT>
    ) : (
        IApp<any>
    ) => {
        preRouteHandlers.push(AsyncValueHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.createSubApp = (path? : string) : (
        IApp<any>
    ) => {
        const subApp = app();
        result.use(
            (typeof path == "string") ?
                path
                    .replace(/\/{2,}/g, "/")
                    .replace(/\/$/g, "") :
                "/",
            subApp
        );
        for (const handler of preRouteHandlers) {
            if (VoidHandlerUtil.isSafeRequestVoidHandler(handler)) {
                subApp.voidHandler(handler);
            } else {
                subApp.errorVoidHandler(handler);
            }
        }
        return subApp;
    };
    result.createRouter = (path? : string) : (
        IRouter<any>
    ) => {
        const r = router();
        result.use(
            (typeof path == "string") ?
                path
                    .replace(/\/{2,}/g, "/")
                    .replace(/\/$/g, "") :
                "/",
            r
        );
        for (const handler of preRouteHandlers) {
            if (VoidHandlerUtil.isSafeRequestVoidHandler(handler)) {
                r.voidHandler(handler);
            } else {
                r.errorVoidHandler(handler);
            }
        }
        return r;
    };

    result.createRoute = <RouteDeclarationT extends rd.RouteData> (
        routeDeclaration : RouteDeclarationT
    ) : IRoute<any> => {
        return route(
            routeDeclaration,
            result,
            preRouteHandlers
        );
    };

    const originalUse = result.use.bind(result);
    result.use = (...args : any[]) => {
        for (const arg of args) {
            if (arg != undefined && arg.__hasParentApp === true) {
                throw new Error(`Attempt to use sub-app/router already used by an app`);
            }
        }
        return originalUse(...args);
    };

    return result;
}