import * as express from "../../../../../dist";

const app = express.app();
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

declare function valuesOfRequiredLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.RequiredLocalsOf<AppT>[
        keyof express.AppUtil.RequiredLocalsOf<AppT>
    ]
);

export const valuesNoLocals = valuesOfRequiredLocals(subAppNoLocals);
app.use(subAppNoLocals);
app.use("/test", subAppNoLocals);

export const valuesNoLocals2 = valuesOfRequiredLocals(subAppNoLocals2);
app.use(subAppNoLocals2);
app.use("/test", subAppNoLocals2);

export const valuesLocalsAreAny = valuesOfRequiredLocals(subAppLocalsAreAny);
app.use(subAppLocalsAreAny);
app.use("/test", subAppLocalsAreAny);

export const valuesLocalsAreUnknown = valuesOfRequiredLocals(subAppLocalsAreUnknown);
app.use(subAppLocalsAreUnknown);
app.use("/test", subAppLocalsAreUnknown);

export const valuesLocalsAreNever = valuesOfRequiredLocals(subAppLocalsAreNever);
app.use(subAppLocalsAreNever);
app.use("/test", subAppLocalsAreNever);

export const valuesLocalsAreString = valuesOfRequiredLocals(subAppLocalsAreString);
app.use(subAppLocalsAreString);
app.use("/test", subAppLocalsAreString);

export const valuesOneStringValue = valuesOfRequiredLocals(subAppOneStringValue);
app.use(subAppOneStringValue);
app.use("/test", subAppOneStringValue);

export const valuesOneStringNumberValue = valuesOfRequiredLocals(subAppOneStringNumberValue);
app.use(subAppOneStringNumberValue);
app.use("/test", subAppOneStringNumberValue);
