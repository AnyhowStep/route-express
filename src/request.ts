import * as express from "express";

export interface RequestData {
    readonly params  : any;
    readonly query   : any;
    readonly body    : any;
    readonly headers : any;
}

export interface Request<DataT extends RequestData> extends express.Request {
    readonly params  : DataT["params"];
    readonly query   : DataT["query"];
    readonly body    : DataT["body"];
    /*
        If nothing set, it should be,
        {
            [header: string]: string | (string[]) | undefined;
        }
    */
   readonly headers : DataT["headers"];
}