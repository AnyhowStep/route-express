import * as express from "../../../../../dist";
import * as http from "http";

const subAppNoLocals = express.app();
const subAppNoLocals2 = express.app<{}>();
const subAppLocalsAreAny = express.app<{
    [k : string] : any
}>();
const subAppLocalsAreUnknown = express.app<{
    [k : string] : unknown
}>();
const subAppLocalsAreNever = express.app<{
    [k : string] : never
}>();
const subAppLocalsAreString = express.app<{
    [k : string] : string
}>();
const subAppOneStringValue = express.app<{
    test : string
}>();
const subAppOneStringNumberValue = express.app<{
    test : string,
    test2 : number,
}>();

http.createServer(subAppNoLocals);
http.createServer(subAppNoLocals2);
http.createServer(subAppLocalsAreAny);
http.createServer(subAppLocalsAreUnknown);
http.createServer(subAppLocalsAreNever);
http.createServer(subAppLocalsAreString);
http.createServer(subAppOneStringValue);
http.createServer(subAppOneStringNumberValue);

declare function valuesOfRequiredLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.RequiredLocalsOf<AppT>[
        keyof express.AppUtil.RequiredLocalsOf<AppT>
    ]
);

export const valuesNoLocals = valuesOfRequiredLocals(subAppNoLocals);
export const valuesNoLocals2 = valuesOfRequiredLocals(subAppNoLocals2);
export const valuesLocalsAreAny = valuesOfRequiredLocals(subAppLocalsAreAny);
export const valuesLocalsAreUnknown = valuesOfRequiredLocals(subAppLocalsAreUnknown);
export const valuesLocalsAreNever = valuesOfRequiredLocals(subAppLocalsAreNever);
export const valuesLocalsAreString = valuesOfRequiredLocals(subAppLocalsAreString);
export const valuesOneStringValue = valuesOfRequiredLocals(subAppOneStringValue);
export const valuesOneStringNumberValue = valuesOfRequiredLocals(subAppOneStringNumberValue);
