import * as express from "../../../../../dist";

export const app = express.app()
    .asyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals
        return 1;
    });