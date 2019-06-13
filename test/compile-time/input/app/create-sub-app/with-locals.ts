import * as myExpress from "../../../../../dist";

export const subApp = myExpress.app()
    .asyncValueHandler(async () => {
        return {
            field : 99,
        } as const;
    })
    .createSubApp();

export const subApp2 = myExpress.app()
    .asyncValueHandler(async () => {
        return {
            field : 99,
        } as const;
    })
    .asyncErrorValueHandler(async () => {
        return {
            field2 : "hello",
        } as const;
    })
    .createSubApp();