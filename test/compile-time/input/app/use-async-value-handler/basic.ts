import * as express from "../../../../../dist";

export const app = express.app()
    .asyncValueHandler<{ test : 2 }>(async (req, res) => {
        req.params
        res.locals
        return {
            test : 2
        };
    });