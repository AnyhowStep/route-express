import * as myExpress from "../../../../../dist";

export const router = myExpress.app()
    .asyncValueHandler(async () => {
        return {
            field : 99,
        } as const;
    })
    .createRouter();

export const router2 = myExpress.app()
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
    .createRouter();