import {Locals} from "../locals";

export interface ValueNextFunction<NextLocalsT extends Locals> {
    readonly success : (nextLocals : NextLocalsT) => void,
    readonly failure : (err : any) => void,
}