/**
    Should only be used in return type annotation of
    generic functions/methods.

    https://github.com/microsoft/TypeScript/issues/29133
*/
export type AssertReturnType<
    F extends (...args : any[]) => any,
    ExpectedReturnTypeT,
    ResultT
> = (
    ReturnType<F> extends ExpectedReturnTypeT ?
    ResultT :
    void|["Expected return type", ExpectedReturnTypeT, "received", ReturnType<F>]
);