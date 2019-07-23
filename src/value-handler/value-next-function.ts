import {Locals} from "../locals";

export interface ValueNextFunction<NextLocalsT extends Locals> {
    /**
        Performs a deep merge on `res.locals` and `nextLocals`.
        Will not let you change values, only merge objects.
    */
    readonly success : (nextLocals : Readonly<NextLocalsT>) => void,
    /**
        The same as calling `next(err)` in `express`
    */
    readonly failure : (err : any) => void,
}