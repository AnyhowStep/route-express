import * as rd from "route-declaration";
import * as express from "express";
import * as expressCore from "express-serve-static-core";
import {IRoute, RouteData, route} from "../route";
import * as RouteDeclarationUtil from "../route-declaration-util";
import {Locals} from "../locals";
import {ErrorVoidHandler, VoidHandler} from "../void-handler";
import {ErrorValueHandler, ValueHandler, ValueHandlerUtil, isRequestValueHandler} from "../value-handler";
import {AsyncErrorVoidHandler, isAsyncRequestVoidHandler, AsyncVoidHandlerUtil, AsyncVoidHandler} from "../async-void-handler";
import {AsyncErrorValueHandler, AsyncValueHandler, isAsyncRequestValueHandler, AsyncValueHandlerUtil} from "../async-value-handler";
import {IRouter} from "./router";
import * as RouterUtil from "./util";

export function router<RequiredLocalsT extends Locals={}> () {
    const handlers : VoidHandler<RouteData>[] = [];
    const result = express.Router() as unknown as IRouter<{
        requiredLocals : RequiredLocalsT,
        locals : RequiredLocalsT,
    }>;

    result.voidHandler = (handler : VoidHandler<RouterUtil.ToRouteData<any>>) : IRouter<any> => {
        handlers.push(handler);
        return result;
    };
    result.errorVoidHandler = (handler : ErrorVoidHandler<RouterUtil.ToRouteData<any>>) : IRouter<any> => {
        handlers.push(handler);
        return result;
    };

    result.valueHandler = (handler : ValueHandler<RouterUtil.ToRouteData<any>, any>) : IRouter<any> => {
        if (isRequestValueHandler(handler)) {
            handlers.push(ValueHandlerUtil.toRequestVoidHandler(handler));
        } else {
            handlers.push(ValueHandlerUtil.toErrorVoidHandler(handler));
        }
        return result;
    };
    result.errorValueHandler = (handler : ErrorValueHandler<RouterUtil.ToRouteData<any>, any>) : IRouter<any> => {
        handlers.push(ValueHandlerUtil.toErrorVoidHandler(handler));
        return result;
    };

    result.asyncVoidHandler = (handler : AsyncVoidHandler<RouterUtil.ToRouteData<any>>) : IRouter<any> => {
        if (isAsyncRequestVoidHandler(handler)) {
            handlers.push(AsyncVoidHandlerUtil.toRequestVoidHandler(handler));
        } else {
            handlers.push(AsyncVoidHandlerUtil.toErrorVoidHandler(handler));
        }
        return result;
    };
    result.asyncErrorVoidHandler = (handler : AsyncErrorVoidHandler<RouterUtil.ToRouteData<any>>) : IRouter<any> => {
        handlers.push(AsyncVoidHandlerUtil.toErrorVoidHandler(handler));
        return result;
    };

    result.asyncValueHandler = (handler : AsyncValueHandler<RouterUtil.ToRouteData<any>, any>) : IRouter<any> => {
        if (isAsyncRequestValueHandler(handler)) {
            handlers.push(AsyncValueHandlerUtil.toRequestVoidHandler(handler));
        } else {
            handlers.push(AsyncValueHandlerUtil.toErrorVoidHandler(handler));
        }
        return result;
    };
    result.asyncErrorValueHandler = (handler : AsyncErrorValueHandler<RouterUtil.ToRouteData<any>, any>) : IRouter<any> => {
        handlers.push(AsyncValueHandlerUtil.toErrorVoidHandler(handler));
        return result;
    };

    result.add = <RouteDeclarationT extends rd.RouteData>(
        routeDeclaration : RouteDeclarationT
    ) => {
        const newRoute = route<RouteDeclarationT>(
            routeDeclaration,
            result as unknown as expressCore.IRouter
        );
        for (const handler of handlers) {
            newRoute.voidHandler(handler as any);
        }
        return newRoute as IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, any>>;
    };
    return result;
}