import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    request: {
        readonly params: {};
        readonly query: {};
        readonly body: {};
        readonly headers: {
            [key: string]: string | string[] | undefined;
        };
    };
    response: {
        locals: {
            isRequiredLocals: true;
        } & {
            readonly inLocals: true;
        } & {
            test: 2;
        };
        json: never;
    };
}>;
