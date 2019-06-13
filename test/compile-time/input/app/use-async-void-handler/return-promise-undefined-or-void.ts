import * as express from "../../../../../dist";

export const app = express.app()
    .asyncVoidHandler((req, res) => {
        req.params
        res.locals
        return Promise.resolve<undefined|void>(undefined);
    });