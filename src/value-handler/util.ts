import * as tm from "type-mapping";
import {RequestValueHandler, ErrorValueHandler, ValueHandler} from "./value-handler";
import {RouteData} from "../route";
import {RequestVoidHandler, ErrorVoidHandler, VoidNextFunction} from "../void-handler";
import {Request} from "../request";
import {Response} from "../response";

export type RouteDataOf<HandlerT extends ValueHandler<RouteData, any>> = (
    HandlerT extends RequestValueHandler<infer DataT, any> ?
    DataT :
    HandlerT extends ErrorValueHandler<infer DataT, any> ?
    DataT :
    never
);
export type NextLocalsOf<HandlerT extends ValueHandler<any, any>> = (
    HandlerT extends RequestValueHandler<any, infer NextLocalsT> ?
    NextLocalsT :
    HandlerT extends ErrorValueHandler<any, infer NextLocalsT> ?
    NextLocalsT :
    never
);
export function toSafeRequestVoidHandler<HandlerT extends RequestValueHandler<any, any>> (
    handler : HandlerT
) : RequestVoidHandler<RouteDataOf<HandlerT>> {
    return (
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(req, res, {
            success : (nextLocals : any) => {
                (res as { locals : any }).locals = tm.TypeUtil.deepMerge(res.locals, nextLocals);
                next();
            },
            failure : (err : any) => {
                next(err);
            },
        });
    };
}
export function toSafeErrorVoidHandler<HandlerT extends ErrorValueHandler<any, any>> (
    handler : HandlerT
) : ErrorVoidHandler<RouteDataOf<HandlerT>> {
    return (
        err : any,
        req : Request<RouteDataOf<HandlerT>["request"]>,
        res : Response<RouteDataOf<HandlerT>["response"]>,
        next : VoidNextFunction
    ) => {
        handler(err, req, res, {
            success : (nextLocals : any) => {
                (res as { locals : any }).locals = tm.TypeUtil.deepMerge(res.locals, nextLocals);
                next();
            },
            failure : (err : any) => {
                next(err);
            },
        });
    };
}