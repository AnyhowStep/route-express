import {RouteData} from "../route";
import {Request} from "../request";
import {Response} from "../response";
import {Locals} from "../locals";

export interface AsyncRequestValueHandler<DataT extends RouteData, NextLocalsT extends Locals> {
    (
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : Promise<NextLocalsT>;
}
export interface AsyncErrorValueHandler<DataT extends RouteData, NextLocalsT extends Locals> {
    (
        err  : any,
        req  : Request<DataT["request"]>,
        res  : Response<DataT["response"]>
    ) : Promise<NextLocalsT>;
}
export type AsyncValueHandler<DataT extends RouteData, NextLocalsT extends Locals> = (
    | AsyncRequestValueHandler<DataT, NextLocalsT>
    | AsyncErrorValueHandler<DataT, NextLocalsT>
);
