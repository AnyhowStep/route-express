import * as myExpress from "../../../../../dist";
import * as express from "express";

const myApp = myExpress.app();
const app = express();

const myRouter = myExpress.router();

myRouter.use(myApp);
myRouter.use("/test", myApp);

myRouter.use(app);
myRouter.use("/test", app);
