import * as myExpress from "../../../../../dist";

const myApp = myExpress.app();
const subApp = myApp.createSubApp();

myApp.use(myApp);
myApp.use("/test", myApp);

myApp.use(subApp);
myApp.use("/test", subApp);

subApp.use(myApp);
subApp.use("/test", myApp);

subApp.use(subApp);
subApp.use("/test", subApp);