import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    readonly request: {
        readonly params: {};
        readonly query: {};
        readonly body: {};
        readonly headers: {
            [key: string]: string | string[] | undefined;
        };
    };
    readonly response: {
        readonly locals: {
            isRequiredLocals: true;
        };
        readonly json: never;
    };
}>;
