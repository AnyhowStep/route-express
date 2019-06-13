import * as express from "express";
import * as expressCore from "express-serve-static-core";
import {Locals} from "../locals";
import {IRouter, RouterData} from "../router";
import {__RequestValueHandler, __ErrorValueHandler} from "../value-handler";
import {__RequestVoidHandler, __ErrorVoidHandler} from "../void-handler";
import {__AsyncRequestVoidHandler, __AsyncErrorVoidHandler} from "../async-void-handler";
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
    voidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<AppUtil.ToRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    errorVoidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<AppUtil.ToRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );

    /**
        If passing a function literal,
        you'll probably need to specify `NextLocalsT`
        as TS will not be able to infer it properly.
    */
    valueHandler<
        NextLocalsT extends Locals,
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
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
    > (handler : __ErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT, ReturnT>) : (
        IApp<{
            requiredLocals : DataT["requiredLocals"],
            locals : (
                & DataT["locals"]
                & NextLocalsT
            ),
        }>
    );

    asyncVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<AppUtil.ToRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    asyncErrorVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<AppUtil.ToRouteData<DataT>, ReturnT>) : (
        IApp<DataT>
    );

    asyncValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncRequestValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
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
    */
    asyncErrorValueHandler<
        NextLocalsT extends Locals
    > (handler : AsyncErrorValueHandler<AppUtil.ToRouteData<DataT>, NextLocalsT>) : (
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