import * as myExpress from "../../../../../dist";
export declare const subApp: myExpress.IApp<{
    __hasParentApp: true;
    locals: {
        readonly field: 99;
    };
}>;
export declare const subApp2: myExpress.IApp<{
    __hasParentApp: true;
    locals: Partial<{
        readonly field: 99;
    } & {
        readonly field2: "hello";
    }>;
}>;
