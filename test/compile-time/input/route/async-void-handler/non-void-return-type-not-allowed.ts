import * as express from "../../../../../dist";

export const route = express.route(null as any, null as any, null as any)
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals
        return 1;
    });