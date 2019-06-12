import * as express from "../../../../../dist";

const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            foo : true as true|1,
            bar : null as null|string,
        };
    });

declare function valuesOfRequiredLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.RequiredLocalsOf<AppT>[
        keyof express.AppUtil.RequiredLocalsOf<AppT>
    ]
);

const subAppExact = express.app<{
    foo : true|1,
    bar : null|string,
}>();
export const valuesExact = valuesOfRequiredLocals(subAppExact);
app.use(subAppExact);
app.use("/test", subAppExact);

const subAppSub = express.app<{
    foo : true,
    bar : null|string,
}>();
export const valuesSub = valuesOfRequiredLocals(subAppSub);
app.use(subAppSub);
app.use("/test", subAppSub);

const subAppSuper = express.app<{
    foo : true|1|2,
    bar : null|string,
}>();
export const valuesSuper = valuesOfRequiredLocals(subAppSuper);
app.use(subAppSuper);
app.use("/test", subAppSuper);
