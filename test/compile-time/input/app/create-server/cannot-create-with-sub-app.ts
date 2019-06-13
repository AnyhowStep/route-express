import * as myExpress from "../../../../../dist";
import * as http from "http";

const subApp = myExpress.app()
    .createSubApp();

http.createServer(subApp);
http.createServer(subApp);