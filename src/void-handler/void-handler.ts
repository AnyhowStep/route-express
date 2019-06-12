import {RouteData} from "../route";
import {Request} from "../request";
import {Response} from "../response";
import {VoidNextFunction} from "./void-next-function";

export interface RequestVoidHandler<DataT extends RouteData> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : VoidNextFunction
    ) : void;
}
export interface ErrorVoidHandler<DataT extends RouteData> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : VoidNextFunction
    ) : void;
}
export type VoidHandler<DataT extends RouteData> = (
    | RequestVoidHandler<DataT>
    | ErrorVoidHandler<DataT>
);
/**
    express thinks error middleware should have exactly four arguments.
    https://github.com/expressjs/express/blob/e1b45ebd050b6f06aa38cda5aaf0c21708b0c71e/lib/router/layer.js#L65

    ```ts
    if (fn.length !== 4) {
        // not a standard error handler
        return next(error);
    }
    ```

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
export function isRequestVoidHandler<DataT extends RouteData> (
    handler : VoidHandler<DataT>
) : handler is RequestVoidHandler<DataT> {
    return (handler.length <= 3);
}