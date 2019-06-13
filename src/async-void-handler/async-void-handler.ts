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

//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __AsyncRequestVoidHandler<DataT extends RouteData, ReturnT extends Promise<void|undefined>> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : ReturnT;
}
//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __AsyncErrorVoidHandler<DataT extends RouteData, ReturnT extends Promise<void|undefined>> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : ReturnT;
}