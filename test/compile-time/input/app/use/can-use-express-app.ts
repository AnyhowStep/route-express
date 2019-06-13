import * as myExpress from "../../../../../dist";
import * as express from "express";

const myApp = myExpress.app();
const app = express();

myApp.use(myApp);
myApp.use("/test", myApp);

myApp.use(app);
myApp.use("/test", app);

app.use(myApp);
app.use("/test", myApp);

app.use(app);
app.use("/test", app);