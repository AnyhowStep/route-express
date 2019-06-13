import {RouteData} from "../route";
import {Request} from "../request";
import {Response} from "../response";
import {ValueNextFunction} from "./value-next-function";
import {Locals} from "../locals";

export interface RequestValueHandler<DataT extends RouteData, NextLocalsT extends Locals> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : ValueNextFunction<NextLocalsT>
    ) : void;
}
export interface ErrorValueHandler<DataT extends RouteData, NextLocalsT extends Locals> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : ValueNextFunction<NextLocalsT>
    ) : void;
}
export type ValueHandler<DataT extends RouteData, NextLocalsT extends Locals> = (
    | RequestValueHandler<DataT, NextLocalsT>
    | ErrorValueHandler<DataT, NextLocalsT>
);

//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __RequestValueHandler<DataT extends RouteData, NextLocalsT extends Locals, ReturnT extends void|undefined> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : ValueNextFunction<NextLocalsT>
    ) : ReturnT;
}
//Additional typedefs to help with compile-time safety
//TODO Better name
export interface __ErrorValueHandler<DataT extends RouteData, NextLocalsT extends Locals, ReturnT extends void|undefined> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>,
        next : ValueNextFunction<NextLocalsT>
    ) : ReturnT;
}