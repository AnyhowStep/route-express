import * as myExpress from "../../../../../dist";

const myApp = myExpress.app();
const myChildRouter = myApp.createRouter();

const myRouter = myExpress.router();

myRouter.use(myChildRouter);
myRouter.use("/test", myChildRouter);

myChildRouter.use(myChildRouter);
myChildRouter.use("/test", myChildRouter);