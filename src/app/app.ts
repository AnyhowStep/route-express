import * as express from "express";
import * as expressCore from "express-serve-static-core";
import {Locals} from "../locals";
import {IRouter, RouterData} from "../router";
import {RequestValueHandler, ErrorValueHandler} from "../value-handler";
import {RequestVoidHandler, ErrorVoidHandler} from "../void-handler";
import {AsyncRequestVoidHandler, AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler} from "../async-value-handler";
import * as http from "http";
import * as AppUtil from "./util";

export interface AppData {
    //To use this app
    requiredLocals : Locals,
    locals : Locals,
}

export type IAppBase<DataT extends AppData> = (
    & Omit<expressCore.Express, "use">
    //A modification of RequestListener implementation
    //so we can't call `http.createServer(app)`
    //if it has requiredLocals
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
    //to make it incompatible if it has requiredLocals
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
export interface IApp<DataT extends AppData> extends IAppBase<DataT> {
    useVoidHandler (handler : RequestVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `useErrorVoidHandler()` until the above is fixed.
    */
    useVoidHandler (handler : ErrorVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `useVoidHandler()`
    */
    useErrorVoidHandler (handler : ErrorVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;

    useValueHandler<NextLocalsT extends Locals> (handler : RequestValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `useErrorValueHandler()` until the above is fixed.
    */
    useValueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
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
        `useValueHandler()`
    */
    useErrorValueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );

    useAsyncVoidHandler (handler : AsyncRequestVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `useAsyncErrorVoidHandler()` until the above is fixed.
    */
    useAsyncVoidHandler (handler : AsyncErrorVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `useAsyncVoidHandler()`
    */
    useAsyncErrorVoidHandler (handler : AsyncErrorVoidHandler<AppUtil.ToRouteData<DataT>>) : IApp<DataT>;

    useAsyncValueHandler<NextLocalsT extends Locals> (handler : AsyncRequestValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `useAsyncErrorValueHandler()` until the above is fixed.
    */
    useAsyncValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
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
        `useAsyncValueHandler()`
    */
    useAsyncErrorValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );

    use : (
        & expressCore.ApplicationRequestHandler<this>
        & {
            <RouterDataT extends RouterData>(
                router : AppUtil.AssertCanUse<
                    DataT,
                    RouterDataT,
                    IRouter<RouterDataT>
                >
            ) : IApp<DataT>
        }
        & {
            <RouterDataT extends RouterData>(
                path : expressCore.PathParams,
                router : AppUtil.AssertCanUse<
                    DataT,
                    RouterDataT,
                    IRouter<RouterDataT>
                >
            ) : IApp<DataT>
        }
        & {
            <SubAppDataT extends AppData>(
                subApp : AppUtil.AssertCanUse<
                    DataT,
                    SubAppDataT,
                    IApp<SubAppDataT>
                >
            ) : IApp<DataT>
        }
        & {
            <SubAppDataT extends AppData>(
                path : expressCore.PathParams,
                router : AppUtil.AssertCanUse<
                    DataT,
                    SubAppDataT,
                    IApp<SubAppDataT>
                >
            ) : IApp<DataT>
        }
    );
}
export function app<RequiredLocalsT extends Locals={}> () {
    const result = express() as unknown as IApp<{
        requiredLocals : RequiredLocalsT,
        locals : RequiredLocalsT,
    }>;
    return result;
}