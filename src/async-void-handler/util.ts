import {AsyncRequestVoidHandler, AsyncErrorVoidHandler, AsyncVoidHandler} from "./async-void-handler";
import {RouteData} from "../route";
import {RequestVoidHandler, ErrorVoidHandler, VoidNextFunction} from "../void-handler";
import {Request} from "../request";
import {Response} from "../response";

export type RouteDataOf<HandlerT extends AsyncVoidHandler<RouteData>> = (
    HandlerT extends AsyncRequestVoidHandler<infer DataT> ?
    DataT :
    HandlerT extends AsyncErrorVoidHandler<infer DataT> ?
    DataT :
    never
);
export function toSafeRequestVoidHandler<HandlerT extends AsyncRequestVoidHandler<any>> (
    handler : HandlerT
) : RequestVoidHandler<RouteDataOf<HandlerT>> {
    return (
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(req, res)
            .then(() => {
                //Some people like to return values in void functions.
                //This prevents it from being treated as an error.
                next();
            })
            .catch(next);
    };
}
export function toSafeErrorVoidHandler<HandlerT extends AsyncErrorVoidHandler<any>> (
    handler : HandlerT
) : ErrorVoidHandler<RouteDataOf<HandlerT>> {
    return (
        err : any,
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(err, req, res)
            .then(() => {
                //Some people like to return values in void functions.
                //This prevents it from being treated as an error.
                next();
            })
            .catch(next);
    };
}