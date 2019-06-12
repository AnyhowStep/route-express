import {RequestData} from "../request";
import {ResponseData} from "../response";
import {RequestVoidHandler, ErrorVoidHandler} from "../void-handler";
import {RequestValueHandler, ErrorValueHandler} from "../value-handler";
import {AsyncRequestVoidHandler, AsyncErrorVoidHandler} from "../async-void-handler";
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
    voidHandler (handler : RequestVoidHandler<DataT>) : IRoute<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorVoidHandler()` until the above is fixed.
    */
    voidHandler (handler : ErrorVoidHandler<DataT>) : IRoute<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `voidHandler()`
    */
    errorVoidHandler (handler : ErrorVoidHandler<DataT>) : IRoute<DataT>;

    valueHandler<NextLocalsT extends Locals> (handler : RequestValueHandler<DataT, NextLocalsT>) : (
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
        https://github.com/microsoft/TypeScript/issues/31867

        Use `errorValueHandler()` until the above is fixed.
    */
    valueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<DataT, NextLocalsT>) : (
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

        When it is fixed, you should go back to using
        `valueHandler()`
    */
    errorValueHandler<NextLocalsT extends Locals> (handler : ErrorValueHandler<DataT, NextLocalsT>) : (
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

    asyncVoidHandler (handler : AsyncRequestVoidHandler<DataT>) : IRoute<DataT>;
    /**
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorVoidHandler()` until the above is fixed.
    */
    asyncVoidHandler (handler : AsyncErrorVoidHandler<DataT>) : IRoute<DataT>;
    /**
        This method was added as a workaround for,
        https://github.com/microsoft/TypeScript/issues/31867

        When it is fixed, you should go back to using
        `asyncVoidHandler()`
    */
    asyncErrorVoidHandler (handler : AsyncErrorVoidHandler<DataT>) : IRoute<DataT>;

    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncRequestValueHandler<DataT, NextLocalsT>) : (
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
        https://github.com/microsoft/TypeScript/issues/31867

        Use `asyncErrorValueHandler()` until the above is fixed.
    */
    asyncValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<DataT, NextLocalsT>) : (
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

        When it is fixed, you should go back to using
        `asyncValueHandler()`
    */
    asyncErrorValueHandler<NextLocalsT extends Locals> (handler : AsyncErrorValueHandler<DataT, NextLocalsT>) : (
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