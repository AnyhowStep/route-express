import * as myExpress from "../../../../../dist";
export declare const router: myExpress.IRouter<{
    __hasParentApp: true;
    locals: {
        readonly field: 99;
    };
}>;
export declare const router2: myExpress.IRouter<{
    __hasParentApp: true;
    locals: Partial<{
        readonly field: 99;
    } & {
        readonly field2: "hello";
    }>;
}>;
