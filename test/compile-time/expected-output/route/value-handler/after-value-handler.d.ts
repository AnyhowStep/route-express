import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    request: {
        readonly params: any;
        readonly query: any;
        readonly body: any;
        readonly headers: any;
    };
    response: {
        locals: {
            readonly inLocals: true;
        } & {
            test: 2;
        };
        json: (response: any) => express.Response<{
            readonly locals: {};
            readonly json: any;
        }>;
    };
}>;
