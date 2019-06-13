import * as rd from "route-declaration";
import * as express from "express";
import * as expressCore from "express-serve-static-core";
import {IRoute, route} from "../route";
import * as RouteDeclarationUtil from "../route-declaration-util";
import {VoidHandler, __RequestVoidHandler, VoidHandlerUtil, __ErrorVoidHandler} from "../void-handler";
import {ValueHandlerUtil, __RequestValueHandler, __ErrorValueHandler} from "../value-handler";
import {AsyncVoidHandlerUtil, __AsyncRequestVoidHandler, __AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncErrorValueHandler, AsyncValueHandlerUtil, AsyncRequestValueHandler} from "../async-value-handler";
import {IRouter} from "./router";
import * as RouterUtil from "./util";
import {Locals} from "../locals";

/**
    Creates a new router.
    Is backwards compatible with `expressCore.IRouter`.
*/
export function router () {
    const handlers : VoidHandler<any>[] = [];
    const result = express.Router() as unknown as IRouter<{
        __hasParentApp : false,
        locals : {},
    }>;

    result.__hasParentApp = false;

    result.voidHandler = <
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<RouterUtil.ToRouteData<any>, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(VoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.errorVoidHandler = <
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<RouterUtil.ToRouteData<any>, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(VoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.valueHandler = <
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestValueHandler<RouterUtil.ToRouteData<any>, NextLocalsT, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(ValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.errorValueHandler = <
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorValueHandler<RouterUtil.ToRouteData<any>, NextLocalsT, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(ValueHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.asyncVoidHandler = <
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<RouterUtil.ToRouteData<any>, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(AsyncVoidHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.asyncErrorVoidHandler = <
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<RouterUtil.ToRouteData<any>, ReturnT>) : (
        IRouter<any>
    ) => {
        handlers.push(AsyncVoidHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.asyncValueHandler = <NextLocalsT extends Locals> (
        handler : AsyncRequestValueHandler<RouterUtil.ToRouteData<any>, NextLocalsT>
    ) : (
        IRouter<any>
    ) => {
        handlers.push(AsyncValueHandlerUtil.toSafeRequestVoidHandler(handler));
        return result;
    };
    result.asyncErrorValueHandler = <NextLocalsT extends Locals> (
        handler : AsyncErrorValueHandler<RouterUtil.ToRouteData<any>, NextLocalsT>
    ) : (
        IRouter<any>
    ) => {
        handlers.push(AsyncValueHandlerUtil.toSafeErrorVoidHandler(handler));
        return result;
    };

    result.createRoute = <RouteDeclarationT extends rd.RouteData>(
        routeDeclaration : RouteDeclarationT
    ) => {
        const newRoute = route<RouteDeclarationT>(
            routeDeclaration,
            result as unknown as expressCore.IRouter
        );
        for (const handler of handlers) {
            if (VoidHandlerUtil.isSafeRequestVoidHandler(handler)) {
                newRoute.voidHandler(handler);
            } else {
                newRoute.errorVoidHandler(handler);
            }
        }
        return newRoute as IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, any>>;
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