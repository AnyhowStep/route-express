import * as express from "../../../../../dist";

const subApp = express.app()
    .useAsyncValueHandler(async () => {
        return {
            test : 32,
        };
    });
declare function valuesOfRequiredLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.RequiredLocalsOf<AppT>[
        keyof express.AppUtil.RequiredLocalsOf<AppT>
    ]
);
export const subAppRequiredLocals = valuesOfRequiredLocals(subApp);
declare function valuesOfLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.LocalsOf<AppT>[
        keyof express.AppUtil.LocalsOf<AppT>
    ]
);
export const subAppLocals = valuesOfLocals(subApp);

const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            blah : "blah"
        }
    });
app.use(subApp);
app.use("/test", subApp);