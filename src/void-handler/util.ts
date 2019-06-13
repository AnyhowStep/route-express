import {RequestVoidHandler, ErrorVoidHandler, VoidHandler} from "./void-handler";

/**
    Assumes the `VoidHandler<any>` is already safe to use with `express`.
    Meaning, we have used `toSafeRequestVoidHandler()` or `toSafeErrorVoidHandler()`
*/
export function isSafeRequestVoidHandler (handler : VoidHandler<any>) : handler is RequestVoidHandler<any> {
    return (handler.length <= 3);
}

/**
    What TS and `express` believe to be compatible function signatures is very different.
    https://github.com/microsoft/TypeScript/issues/31867

    We use this utility function to increase type safety.

    -----

    express thinks request middleware should have 0,1,2,3 arguments.
    https://github.com/expressjs/express/blob/e1b45ebd050b6f06aa38cda5aaf0c21708b0c71e/lib/router/layer.js#L89

    ```ts
    if (fn.length > 3) {
        // not a standard request handler
        return next();
    }
    ```
*/
export function toSafeRequestVoidHandler<HandlerT extends RequestVoidHandler<any>> (
    unsafeHandler : HandlerT
) : HandlerT {
    if (unsafeHandler.length <= 3) {
        //No changes needed
        return unsafeHandler;
    } else {
        /**
            It is possible they passed in a handler with a 4th default parameter,
            ```ts
            ((req, res, next, extra="hello") => {

            }).length == 4
            ```
        */
        const result = (
            (req, res, next) => {
                return unsafeHandler(req, res, next);
            }
        ) as HandlerT;
        return result;
    }
}

/**
    What TS and `express` believe to be compatible function signatures is very different.
    https://github.com/microsoft/TypeScript/issues/31867

    We use this utility function to increase type safety.

    -----

    express thinks error middleware should have exactly four arguments.
    https://github.com/expressjs/express/blob/e1b45ebd050b6f06aa38cda5aaf0c21708b0c71e/lib/router/layer.js#L65

    ```ts
    if (fn.length !== 4) {
        // not a standard error handler
        return next(error);
    }
    ```
*/
export function toSafeErrorVoidHandler<HandlerT extends ErrorVoidHandler<any>> (
    unsafeHandler : HandlerT
) : HandlerT {
    if (unsafeHandler.length == 4) {
        //No changes needed
        return unsafeHandler;
    } else {
        /**
            It is possible they passed in a handler with a 5th default parameter,
            ```ts
            ((err, req, res, next, extra="hello") => {

            }).length == 5
            ```

            -----

            Or they passed in a handler with 0,1,2,3 parameters,
            ```
            ((err, req) => {

            }).length == 2
            ```
        */
        const result = (
            (err, req, res, next) => {
                return unsafeHandler(err, req, res, next);
            }
        ) as HandlerT;
        return result;
    }
}