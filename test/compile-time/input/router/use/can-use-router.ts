import * as myExpress from "../../../../../dist";

const myRouter = myExpress.router();

myRouter.use(myRouter);
myRouter.use("/test", myRouter);