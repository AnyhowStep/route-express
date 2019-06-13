import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    readonly request: {
        readonly params: {
            resourceId: bigint;
        };
        readonly query: {
            format: "json" | "xml" | undefined;
        };
        readonly body: {
            name: string | undefined;
        };
        readonly headers: {
            "api-key": string;
        } & {
            [key: string]: string | string[] | undefined;
        };
    };
    readonly response: {
        readonly locals: {
            readonly inApp: true;
        } & {
            readonly inRouter: true;
        };
        readonly json: (response: {
            resourceId: bigint;
            name: string;
        }) => express.Response<any>;
    };
}>;
