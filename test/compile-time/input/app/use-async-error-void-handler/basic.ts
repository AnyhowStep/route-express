import * as express from "../../../../../dist";

export const app = express.app()
    .asyncErrorVoidHandler((_err, req, res) => {
        req.params
        res.locals
        return Promise.resolve();
    });