import * as express from "express";

export interface ResponseData {
    readonly locals : any;
    json   : (response : any) => Response<ResponseData>;
}

export interface Response<DataT extends ResponseData> extends express.Response {
    readonly locals : DataT["locals"];
    //Not marked readonly so wrappers can be made
    json   : DataT["json"];
}