import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .useAsyncErrorVoidHandler(async (_err, req, res) => {
        req.params
        res.locals.isRequiredLocals
    });