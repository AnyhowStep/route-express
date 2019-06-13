import * as express from "../../../../../dist";
export declare const app: express.IApp<{
    __hasParentApp: true;
    locals: Partial<{
        isRequiredLocals: true;
    } & {
        readonly inLocals: true;
    } & {
        test: 2;
    }>;
}>;
