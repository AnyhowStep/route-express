import * as express from "../../../../../dist";

export const router = express.router()
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals
        return 1;
    });