import * as myExpress from "../../../../../dist";

const myApp = myExpress.app();
const subApp = myApp.createSubApp();

const myRouter = myExpress.router();

myRouter.use(subApp);
myRouter.use("/test", subApp);
