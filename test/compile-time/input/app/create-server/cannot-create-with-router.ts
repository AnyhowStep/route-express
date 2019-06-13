import * as myExpress from "../../../../../dist";
import * as http from "http";

const router = myExpress.router();

http.createServer(router);
http.createServer(router);