import {IApp, AppData} from "./app";
import {Response, ResponseData} from "../response";
import { Locals } from "../locals";

export type RequiredLocalsOf<AppT extends IApp<any>> = (
    AppT extends IApp<infer DataT> ?
    DataT["requiredLocals"] :
    never
);

export type LocalsOf<AppT extends IApp<any>> = (
    AppT extends IApp<infer DataT> ?
    DataT["locals"] :
    never
);

export type DataOf<AppT extends IApp<any>> = (
    AppT extends IApp<infer DataT> ?
    DataT :
    never
);

export type ToRouteData<DataT extends AppData> = (
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

export type AssertCanUse<
    DataT extends AppData,
    OtherT extends { requiredLocals : Locals },
    ResultT
> = (
    string extends Extract<keyof OtherT["requiredLocals"], string> ?
    //string indexer
    (
        unknown extends OtherT["requiredLocals"][keyof OtherT["requiredLocals"]] ?
        ResultT :
        [OtherT["requiredLocals"], "string index signature required but only", { [k : string] : unknown }, "allowed"]
    ) :
    //literal keys
    Extract<keyof OtherT["requiredLocals"], string> extends Extract<keyof DataT["locals"], string> ?
    (
        DataT["locals"] extends OtherT["requiredLocals"] ?
        ResultT :
        [
            "Expected locals mismatch",
            {
                [k in {
                    [innerK in Extract<keyof OtherT["requiredLocals"], Extract<keyof DataT["locals"], string>>] : (
                        DataT["locals"][innerK] extends OtherT["requiredLocals"][innerK] ?
                        never :
                        innerK
                    )
                }[Extract<keyof OtherT["requiredLocals"], Extract<keyof DataT["locals"], string>>]] : (
                    {
                        expected : OtherT["requiredLocals"][k],
                        actual : DataT["locals"][k]
                    }
                )
            }
        ]
    ) :
    [
        "The following locals are required but missing",
        Exclude<
            Extract<keyof OtherT["requiredLocals"], string>,
            Extract<keyof DataT["locals"], string>
        >
    ]
);

export type AssertExpressAppCompatible<
    DataT extends AppData,
    ResultT,
    ErrorT
> = (
    keyof DataT["requiredLocals"] extends never ?
    ResultT :
    unknown extends {
        [k in keyof DataT["requiredLocals"]] : DataT["requiredLocals"][k]
    }[keyof DataT["requiredLocals"]] ?
    ResultT :
    ["This app has requiredLocals", DataT["requiredLocals"], "and cannot be", ErrorT]
);