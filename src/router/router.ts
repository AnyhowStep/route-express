import * as rd from "route-declaration";
import * as expressCore from "express-serve-static-core";
import {IRoute} from "../route";
import * as RouteDeclarationUtil from "../route-declaration-util";
import {Locals} from "../locals";
import {__RequestVoidHandler, __ErrorVoidHandler} from "../void-handler";
import {__RequestValueHandler, __ErrorValueHandler} from "../value-handler";
import {__AsyncRequestVoidHandler, __AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler} from "../async-value-handler";
import * as RouterUtil from "./util";

export interface RouterData {
    __hasParentApp : boolean,
    locals : Locals,
}

/**
    Like `import("express-static-core").IRouter`,
    this is NOT an immutable data structure.

    Each call to `xxxHandler()` modifies the state of the `IRouter<>`
    and returns the same instance of `IRouter<>`.

    No new instance of `IRouter<>` is ever created with a call to `xxxHandler()`.

    You should be careful when keeping around a variable of type `IRouter<>`.

    -----

    The various `xxxHandler()` methods behave differently
    from express' `use()` function.

                    | Scope     | Recursive?    | Applied to
    xxxHandler()    | IRouter   | No            | IRoute
    use(path, fn)   | path      | Parent path   | App

    -----

    It is possible for a `use()` handler to be called,
    even if no route matches the currently called path.

    An `xxxHandler()` will not be called unless
    a route implements the currently called path.

    -----

    If a `use()` handler is added after a route is added,
    it will be called after the route handlers have run.

    If an `xxxHandler()` is added after a route is added,
    it will not be run.
*/
export type IRouterBase<DataT extends RouterData> = (
    & Omit<expressCore.IRouter, never>
    & {
        __hasParentApp : DataT["__hasParentApp"],
    }
    //A modification of expressCore.RequestHandler
    //to make it incompatible if it has a parent app
    & {
        (
            req: RouterUtil.AssertExpressRouterCompatible<
                DataT,
                expressCore.Request,
                expressCore.RequestHandler
            >,
            res: expressCore.Response,
            next: expressCore.NextFunction
        ) : any;
    }
)
export interface IRouter<DataT extends RouterData> extends IRouterBase<DataT> {
    voidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<RouterUtil.ToRequestRouteData<DataT>, ReturnT>) : (
        IRouter<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    errorVoidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<RouterUtil.ToErrorRouteData<DataT>, ReturnT>) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<DataT["locals"]>,
        }>
    );

    /**
        If passing a function literal,
        you'll probably need to specify `NextLocalsT`
        as TS will not be able to infer it properly.
    */
    valueHandler<
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestValueHandler<RouterUtil.ToRequestRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        If passing a function literal,
        you'll probably need to specify `NextLocalsT`
        as TS will not be able to infer it properly.
    */
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    errorValueHandler<
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorValueHandler<RouterUtil.ToErrorRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<
                & DataT["locals"]
                & NextLocalsT
            >,
        }>
    );

    asyncVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<RouterUtil.ToRequestRouteData<DataT>, ReturnT>) : (
        IRouter<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    asyncErrorVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<RouterUtil.ToErrorRouteData<DataT>, ReturnT>) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<DataT["locals"]>,
        }>
    );

    asyncValueHandler<NextLocalsT extends Locals> (
        handler : AsyncRequestValueHandler<RouterUtil.ToRequestRouteData<DataT>, NextLocalsT>
    ) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    asyncErrorValueHandler<NextLocalsT extends Locals> (
        handler : AsyncErrorValueHandler<RouterUtil.ToErrorRouteData<DataT>, NextLocalsT>
    ) : (
        IRouter<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<
                & DataT["locals"]
                & NextLocalsT
            >,
        }>
    );

    createRoute<RouteDeclarationT extends rd.RouteData> (
        routeDeclaration : RouteDeclarationT
    ) : IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, DataT["locals"]>>;
}
