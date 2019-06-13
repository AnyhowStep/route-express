import {IApp, AppData} from "./app";
import {Response, ResponseData} from "../response";

export type DataOf<AppT extends IApp<any>> = (
    AppT extends IApp<infer DataT> ?
    DataT :
    never
);

export type ToRequestRouteData<DataT extends AppData> = (
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

export type ToErrorRouteData<DataT extends AppData> = (
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

export type AssertExpressAppCompatible<
    DataT extends AppData,
    ResultT,
    ErrorT
> = (
    true extends DataT["__hasParentApp"] ?
    ["This app is already used as a sub-app and cannot be", ErrorT] :
    ResultT
);