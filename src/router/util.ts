import {IRouter, RouterData} from "./router";
import {Response, ResponseData} from "../response";

export type RequiredLocalsOf<RouterT extends IRouter<RouterData>> = (
    RouterT extends IRouter<infer DataT> ?
    DataT["requiredLocals"] :
    never
);

export type LocalsOf<RouterT extends IRouter<RouterData>> = (
    RouterT extends IRouter<infer DataT> ?
    DataT["locals"] :
    never
);

export type DataOf<RouterT extends IRouter<RouterData>> = (
    RouterT extends IRouter<infer DataT> ?
    DataT :
    never
);

export type ToRouteData<DataT extends RouterData> = (
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
