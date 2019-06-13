import * as myExpress from "../../../../../dist";
import * as express from "express";
import * as http from "http";

const myApp = myExpress.app();
const app = express();

http.createServer(myApp);
http.createServer(app);