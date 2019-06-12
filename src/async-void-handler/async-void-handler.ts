import {RouteData} from "../route";
import {Request} from "../request";
import {Response} from "../response";

export interface AsyncRequestVoidHandler<DataT extends RouteData> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : Promise<void>;
}
export interface AsyncErrorVoidHandler<DataT extends RouteData> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : Promise<void>;
}
export type AsyncVoidHandler<DataT extends RouteData> = (
    | AsyncRequestVoidHandler<DataT>
    | AsyncErrorVoidHandler<DataT>
);

export function isAsyncRequestVoidHandler<DataT extends RouteData> (
    handler : AsyncVoidHandler<DataT>
) : handler is AsyncRequestVoidHandler<DataT> {
    return (handler.length <= 2);
}