import {RequestData} from "../request";
import {ResponseData} from "../response";
import {__RequestVoidHandler, __ErrorVoidHandler} from "../void-handler";
import {__RequestValueHandler, __ErrorValueHandler} from "../value-handler";
import {__AsyncRequestVoidHandler, __AsyncErrorVoidHandler} from "../async-void-handler";
import {AsyncRequestValueHandler, AsyncErrorValueHandler} from "../async-value-handler";
import {Locals} from "../locals";

export interface RouteData {
    readonly request : RequestData,
    readonly response : ResponseData,
}

/**
    This is NOT an immutable data structure.

    Each call to `xxxHandler()` modifies the state of the `IRoute<>`
    and returns the same instance of `IRoute<>`.

    No new instance of `IRoute<>` is ever created with a call to `xxxHandler()`.

    You should be careful when keeping around a variable of type `IRoute<>`.
*/
export interface IRoute<DataT extends RouteData> {
    voidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __RequestVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    errorVoidHandler<
        ReturnT extends void|undefined=void|undefined
    > (handler : __ErrorVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    );

    /**
        If passing a function literal,
        you'll probably need to specify `NextLocalsT`
        as TS will not be able to infer it properly.
    */
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
    );

    asyncVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncRequestVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
    asyncErrorVoidHandler<
        ReturnT extends Promise<void|undefined>=Promise<void|undefined>
    > (handler : __AsyncErrorVoidHandler<DataT, ReturnT>) : (
        IRoute<DataT>
    );

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
    );
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867
    */
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
    );
}