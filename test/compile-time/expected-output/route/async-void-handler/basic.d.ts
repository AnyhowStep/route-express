import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    readonly request: {
        readonly params: any;
        readonly query: any;
        readonly body: any;
        readonly headers: any;
    };
    readonly response: {
        readonly locals: {};
        readonly json: (response: any) => express.Response<any>;
    };
}>;
