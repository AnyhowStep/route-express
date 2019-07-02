import * as rd from "route-declaration";
import {MappingError, ErrorUtil} from "type-mapping";

export interface OutputMappingError extends Error {
    name : "OutputMappingError",
    routeDeclaration : rd.RouteData,
    response : MappingError,
}

export function isOutputMappingError (x : unknown) : x is OutputMappingError {
    if (!(x instanceof Error)) {
        return false;
    }
    if (x.name != "OutputMappingError") {
        return false;
    }
    const mixed : (
        & Error
        & { [k in Exclude<keyof OutputMappingError, keyof Error>]? : unknown }
    ) = x;
    if (!(mixed.routeDeclaration instanceof Object)) {
        return false;
    }
    if (!ErrorUtil.isMappingError(mixed.response)) {
        return false;
    }
    return true;
}

export interface MakeOutputMappingErrorArgs {
    message : string,
    routeDeclaration : rd.RouteData,
    response : MappingError,
}
export function makeOutputMappingError (args : MakeOutputMappingErrorArgs) : OutputMappingError {
    const err : OutputMappingError = new Error(args.message) as any;
    Object.defineProperty(
        err,
        "name",
        {
            value : "OutputMappingError",
            enumerable : false,
        }
    );
    Object.defineProperty(
        err,
        "routeDeclaration",
        {
            value : args.routeDeclaration,
            enumerable : false,
        }
    );
    Object.defineProperty(
        err,
        "response",
        {
            value : args.response,
            enumerable : false,
        }
    );
    return err;
}