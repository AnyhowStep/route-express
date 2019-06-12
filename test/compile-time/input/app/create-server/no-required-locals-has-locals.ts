import * as express from "../../../../../dist";
import * as http from "http";

const app = express.app()
    .useAsyncValueHandler(async () => {
        return {
            test : 32,
        };
    });
http.createServer(app);
declare function valuesOfRequiredLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.RequiredLocalsOf<AppT>[
        keyof express.AppUtil.RequiredLocalsOf<AppT>
    ]
);
export const appRequiredLocals = valuesOfRequiredLocals(app);
declare function valuesOfLocals<AppT extends express.IApp<any>> (app : AppT) : (
    express.AppUtil.LocalsOf<AppT>[
        keyof express.AppUtil.LocalsOf<AppT>
    ]
);
export const appLocals = valuesOfLocals(app);