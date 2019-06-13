import {IRouter, RouterData} from "./router";
import {Response, ResponseData} from "../response";

export type DataOf<RouterT extends IRouter<RouterData>> = (
    RouterT extends IRouter<infer DataT> ?
    DataT :
    never
);

export type ToRequestRouteData<DataT extends RouterData> = (
    {
        request : {
            params  : { [k : string] : unknown },
            query   : { [k : string] : unknown },
            body    : { [k : string] : unknown },
            headers : { [k : string] : unknown },
        },
        response : {
            locals : DataT["locals"],
            //The ReturnType is technically incorrect
            //I would prefer the param to be `never` but it
            //seems like an `any` arg is not assignable to a `never` param.
            json : (response : unknown) => Response<ResponseData>,
        }
    }
);

export type ToErrorRouteData<DataT extends RouterData> = (
    {
        request : {
            params  : { [k : string] : unknown },
            query   : { [k : string] : unknown },
            body    : { [k : string] : unknown },
            headers : { [k : string] : unknown },
        },
        response : {
            locals : Partial<DataT["locals"]>,
            //The ReturnType is technically incorrect
            //I would prefer the param to be `never` but it
            //seems like an `any` arg is not assignable to a `never` param.
            json : (response : unknown) => Response<ResponseData>,
        }
    }
);

export type AssertExpressRouterCompatible<
    DataT extends RouterData,
    ResultT,
    ErrorT
> = (
    true extends DataT["__hasParentApp"] ?
    ["This router is already used by an app and cannot be", ErrorT] :
    ResultT
);