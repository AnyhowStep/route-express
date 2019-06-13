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

//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __RequestVoidHandler<DataT extends RouteData, ReturnT extends void|undefined> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : VoidNextFunction
    ) : ReturnT;
}
//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __ErrorVoidHandler<DataT extends RouteData, ReturnT extends void|undefined> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : VoidNextFunction
    ) : ReturnT;
}