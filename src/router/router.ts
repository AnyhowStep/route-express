import * as rd from "route-declaration";
import * as expressCore from "express-serve-static-core";
import {IRoute} from "../route";
import * as RouteDeclarationUtil from "../route-declaration-util";
import {Locals} from "../locals";
import {RequestVoidHandler, ErrorVoidHandler} from "../void-handler";
import {RequestValueHandler, ErrorValueHandler} from "../value-handler";
import {AsyncRequestVoidHandler, AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler} from "../async-value-handler";
import * as RouterUtil from "./util";

export interface RouterData {
    //To use this router
    requiredLocals : Locals,
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
    //A modification of expressCore.RequestHandler
    //to make it incompatible if it has requiredLocals
    & {
        (
            req: (
                {} extends DataT["requiredLocals"] ?
                expressCore.Request :
                never
            ),
            res: expressCore.Response,
            next: expressCore.NextFunction
        ) : any;
    }
)
export interface IRouter<DataT extends RouterData> extends IRouterBase<DataT> {
    voidHandler (handler : RequestVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorVoidHandler()` until the above is fixed.
    */
    voidHandler (handler : ErrorVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `voidHandler()`
    */
    errorVoidHandler (handler : ErrorVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;

    valueHandler<NextLocalsT extends Locals> (handler : RequestValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorValueHandler()` until the above is fixed.
    */
    valueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `valueHandler()`
    */
    errorValueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );

    asyncVoidHandler (handler : AsyncRequestVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorVoidHandler()` until the above is fixed.
    */
    asyncVoidHandler (handler : AsyncErrorVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `asyncVoidHandler()`
    */
    asyncErrorVoidHandler (handler : AsyncErrorVoidHandler<RouterUtil.ToRouteData<DataT>>) : IRouter<DataT>;

    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncRequestValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorValueHandler()` until the above is fixed.
    */
    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `asyncValueHandler()`
    */
    asyncErrorValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<RouterUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IRouter<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );

    add<RouteDeclarationT extends rd.RouteData> (
        routeDeclaration : RouteDeclarationT
    ) : IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, DataT["locals"]>>;
}
