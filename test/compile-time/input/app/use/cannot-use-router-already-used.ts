import * as myExpress from "../../../../../dist";
import * as express from "express";

const myApp = myExpress.app();
const app = express();
const myRouter = myApp.createRouter();

myApp.use(myRouter);
myApp.use("/test", myRouter);

app.use(myRouter);
app.use("/test", myRouter);