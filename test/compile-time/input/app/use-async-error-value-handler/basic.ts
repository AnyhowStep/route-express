import * as express from "../../../../../dist";

export const app = express.app()
    .asyncErrorValueHandler<{ test : 2 }>(async (_err, req, res) => {
        req.params
        res.locals
        return {
            test : 2
        };
    });