import * as express from "../../../../../dist";

export const router = express.router()
    .asyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals
        return 1;
    });