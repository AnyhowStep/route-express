import * as express from "express";
import * as tm from "type-mapping";
import * as rd from "route-declaration";
import {RequestVoidHandler} from "../void-handler";
import {RouteData} from "../route";
import {Response, ResponseData} from "../response";
import {makeOutputMappingError} from "../output-mapping-error";

export function mapper<F extends tm.AnySafeMapper> (
    f : F,
    getRawValue : (req  : express.Request, res : express.Response) => {
        readonly name  : string,
        readonly value : any,
    },
    setRawValue : (req  : express.Request, res : express.Response, value : tm.OutputOf<F>) => void
) : RequestVoidHandler<RouteData> {
    return (req, res, next) => {
        const raw = getRawValue(req, res);
        const value = f(raw.name, raw.value);
        setRawValue(req, res, value);
        next();
    };
}
export function responseMapper (
    routeDeclaration : rd.RouteData
) : RequestVoidHandler<RouteData> {
    const f = (routeDeclaration.response == undefined) ?
        () => undefined :
        routeDeclaration.response;
    return (_req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = function (this : Response<ResponseData>, rawBody : any) : Response<ResponseData> {
            if (this.statusCode >= 400 && this.statusCode < 600) {
                //We are in an erroneous state, we don't validate anything for now
                return originalJson(rawBody);
            }
            const mapResult = tm.tryMapHandled(f, "response", rawBody);
            if (mapResult.success) {
                return originalJson(mapResult.value);
            } else {
                throw makeOutputMappingError({
                    message : mapResult.mappingError.message,
                    routeDeclaration,
                    response : mapResult.mappingError,
                });
            }
        };
        next();
    };
}