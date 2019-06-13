import * as express from "../../../../../dist";
export declare const app: express.IApp<{
    requiredLocals: {
        isRequiredLocals: true;
    };
    locals: {
        isRequiredLocals: true;
    } & {
        readonly inLocals: true;
    };
}>;
