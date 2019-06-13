import * as tm from "type-mapping";
import {AsyncRequestValueHandler, AsyncErrorValueHandler, AsyncValueHandler} from "./async-value-handler";
import {RouteData} from "../route";
import {RequestVoidHandler, ErrorVoidHandler, VoidNextFunction} from "../void-handler";
import {Request} from "../request";
import {Response} from "../response";

export type RouteDataOf<HandlerT extends AsyncValueHandler<RouteData, any>> = (
    HandlerT extends AsyncRequestValueHandler<infer DataT, any> ?
    DataT :
    HandlerT extends AsyncErrorValueHandler<infer DataT, any> ?
    DataT :
    never
);
export function toSafeRequestVoidHandler<HandlerT extends AsyncRequestValueHandler<any, any>> (
    handler : HandlerT
) : RequestVoidHandler<RouteDataOf<HandlerT>> {
    return (
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(req, res)
            .then((nextLocals) => {
                (res as { locals : any }).locals = tm.TypeUtil.deepMerge(res.locals, nextLocals);
                next();
            })
            .catch(next);
    };
}
export function toSafeErrorVoidHandler<HandlerT extends AsyncErrorValueHandler<any, any>> (
    handler : HandlerT
) : ErrorVoidHandler<RouteDataOf<HandlerT>> {
    return (
        err : any,
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(err, req, res)
            .then((nextLocals) => {
                (res as { locals : any }).locals = tm.TypeUtil.deepMerge(res.locals, nextLocals);
                next();
            })
            .catch(next);
    };
}