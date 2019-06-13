import * as express from "../../../../../dist";
export declare const route: express.IRoute<{
    request: {
        readonly params: {
            spaceId: string;
        };
        readonly query: {
            format: "json" | "xml" | undefined;
        };
        readonly body: {
            time: Date;
        };
        readonly headers: {
            distortion: string;
        } & {
            [key: string]: string | string[] | undefined;
        };
    };
    response: {
        locals: {
            test: 2;
        };
        json: (response: {
            time: Date;
            spaceId: string;
        }) => express.Response<{
            readonly locals: {};
            readonly json: any;
        }>;
    };
}>;
