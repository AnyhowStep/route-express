import * as express from "../../../../../dist";

export const app = express.app()
    .asyncVoidHandler(async (req, res) => {
        req.params
        res.locals
        return 1;
    });