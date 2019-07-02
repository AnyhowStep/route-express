import * as rd from "route-declaration";
import {MappingError, ErrorUtil} from "type-mapping";

export interface InputMappingError extends Error {
    name : "InputMappingError",
    routeDeclaration : rd.RouteData,
    param?  : MappingError,
    query?  : MappingError,
    body?   : MappingError,
    header? : MappingError,
}

export function isInputMappingError (x : unknown) : x is InputMappingError {
    if (!(x instanceof Error)) {
        return false;
    }
    if (x.name != "InputMappingError") {
        return false;
    }
    const mixed : (
        & Error
        & { [k in Exclude<keyof InputMappingError, keyof Error>]? : unknown }
    ) = x;
    if (!(mixed.routeDeclaration instanceof Object)) {
        return false;
    }
    if (
        mixed.param != undefined &&
        !ErrorUtil.isMappingError(mixed.param)
    ) {
        return false;
    }
    if (
        mixed.query != undefined &&
        !ErrorUtil.isMappingError(mixed.query)
    ) {
        return false;
    }
    if (
        mixed.body != undefined &&
        !ErrorUtil.isMappingError(mixed.body)
    ) {
        return false;
    }
    if (
        mixed.header != undefined &&
        !ErrorUtil.isMappingError(mixed.header)
    ) {
        return false;
    }
    return true;
}

export interface MakeInputMappingErrorArgs {
    message : string,
    routeDeclaration : rd.RouteData,
    param   : MappingError|undefined,
    query   : MappingError|undefined,
    body    : MappingError|undefined,
    header  : MappingError|undefined,
}
export function makeInputMappingError (args : MakeInputMappingErrorArgs) : InputMappingError {
    const err : InputMappingError = new Error(args.message) as any;
    Object.defineProperty(
        err,
        "name",
        {
            value : "InputMappingError",
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
        "param",
        {
            value : args.param,
            enumerable : false,
        }
    );
    Object.defineProperty(
        err,
        "query",
        {
            value : args.query,
            enumerable : false,
        }
    );
    Object.defineProperty(
        err,
        "body",
        {
            value : args.body,
            enumerable : false,
        }
    );
    Object.defineProperty(
        err,
        "header",
        {
            value : args.header,
            enumerable : false,
        }
    );
    return err;
}