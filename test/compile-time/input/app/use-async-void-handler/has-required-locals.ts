import * as express from "../../../../../dist";

export const app = express.app<{ isRequiredLocals : true }>()
    .useAsyncVoidHandler(async (req, res) => {
        req.params
        res.locals.isRequiredLocals
    });