import * as rd from "route-declaration";
import * as expressCore from "express-serve-static-core";
import {Locals} from "../locals";
import {__RequestValueHandler, __ErrorValueHandler} from "../value-handler";
import {__RequestVoidHandler, __ErrorVoidHandler} from "../void-handler";
import {__AsyncRequestVoidHandler, __AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler} from "../async-value-handler";
import * as http from "http";
import * as AppUtil from "./util";
import {IRouter} from "../router";
import {IRoute} from "../route";
import * as RouteDeclarationUtil from "../route-declaration-util";

export interface AppData {
    __hasParentApp : boolean,
    locals : Locals,
}

export type IAppBase<DataT extends AppData> = (
    & Omit<expressCore.Express, never>
    & {
        __hasParentApp : DataT["__hasParentApp"],
    }
    //A modification of RequestListener implementation
    //so we can't call `http.createServer(app)`
    //if it has a parent app
    & {
        /**
         * Express instance itself is a request handler/
         */
        (
            req: AppUtil.AssertExpressAppCompatible<
                DataT,
                expressCore.Request | http.IncomingMessage,
                http.RequestListener
            >,
            res: expressCore.Response | http.ServerResponse
        ) : any;
    }
    //A modification of expressCore.RequestHandler
    //to make it incompatible if it has a parent app
    & {
        (
            req: AppUtil.AssertExpressAppCompatible<
                DataT,
                expressCore.Request,
                expressCore.RequestHandler
            >,
            res: expressCore.Response,
            next: expressCore.NextFunction
        ) : any;
    }
    //Completely unnecessary but adding this so compile-time error
    //messages are easier to understand
    & {
        IncomingMessage? : AppUtil.AssertExpressAppCompatible<
            DataT,
            undefined,
            http.RequestListener
        >,
    }
)
/**
    Completely backwards compatible with `express`,
    unless already used by a parent app.
*/
export interface IApp<DataT extends AppData> extends IAppBase<DataT> {
    voidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<AppUtil.ToRequestRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    errorVoidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<AppUtil.ToErrorRouteData<DataT>, ReturnT>) : (
        IApp<{
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
    > (handler : __RequestValueHandler<AppUtil.ToRequestRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IApp<{
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
    > (handler : __ErrorValueHandler<AppUtil.ToErrorRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IApp<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<
                & DataT["locals"]
                & NextLocalsT
            >,
        }>
    );

    asyncVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<AppUtil.ToRequestRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    asyncErrorVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<AppUtil.ToErrorRouteData<DataT>, ReturnT>) : (
        IApp<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<DataT["locals"]>,
        }>
    );

    asyncValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncRequestValueHandler<AppUtil.ToRequestRouteData<DataT>, NextLocalsT>) : (
        IApp<{
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
    asyncErrorValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncErrorValueHandler<AppUtil.ToErrorRouteData<DataT>, NextLocalsT>) : (
        IApp<{
            __hasParentApp : DataT["__hasParentApp"],
            locals : Partial<
                & DataT["locals"]
                & NextLocalsT
            >,
        }>
    );

    /**
        Creates a new sub app.
        The new sub app is automatically "used" by the parent app.

        Internally, it does something like,
        ```ts
        const subApp = app();
        for (let h of this.handlers) {
            subApp.voidHandler(h);
        }
        this.use(subApp);
        ```
    */
    createSubApp (path? : string) : (
        IApp<{
            __hasParentApp : true,
            locals : DataT["locals"],
        }>
    );

    /**
        Creates a new router.
        The new router is automatically "used" by the parent app.

        Internally, it does something like,
        ```ts
        const r = router();
        for (let h of this.handlers) {
            r.voidHandler(h);
        }
        this.use(r);
        ```
    */
    createRouter (path? : string) : (
        IRouter<{
            __hasParentApp : true,
            locals : DataT["locals"],
        }>
    );

    createRoute<RouteDeclarationT extends rd.RouteData> (
        routeDeclaration : RouteDeclarationT
    ) : IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, DataT["locals"]>>;
}
export type IMainApp<DataT extends Omit<AppData, "__hasParentApp">> = (
    IApp<
        & DataT
        & {
            __hasParentApp : false,
        }
    >
);
export interface ParentApp<LocalsT extends Locals> {
    /**
        Creates a new sub app.
        The new sub app is automatically "used" by the parent app.

        Internally, it does something like,
        ```ts
        const subApp = app();
        for (let h of this.handlers) {
            subApp.voidHandler(h);
        }
        this.use(subApp);
        ```
    */
    createSubApp (path? : string) : (
        IApp<{
            __hasParentApp : true,
            locals : LocalsT,
        }>
    );
    /**
        Creates a new router.
        The new router is automatically "used" by the parent app.

        Internally, it does something like,
        ```ts
        const r = router();
        for (let h of this.handlers) {
            r.voidHandler(h);
        }
        this.use(r);
        ```
    */
    createRouter (path? : string) : (
        IRouter<{
            __hasParentApp : true,
            locals : LocalsT,
        }>
    );

    createRoute<RouteDeclarationT extends rd.RouteData> (
        routeDeclaration : RouteDeclarationT
    ) : IRoute<RouteDeclarationUtil.RouteDataOf<RouteDeclarationT, LocalsT>>;
}