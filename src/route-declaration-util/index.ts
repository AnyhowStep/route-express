import * as rd from "route-declaration";
import {Response} from "../response";

export type RouteDataOf<DataT extends rd.RouteData, LocalsT> = (
    {
        readonly request : {
            readonly params : rd.RouteUtil.ServerParam<DataT>,
            readonly query : rd.RouteUtil.ServerQuery<DataT>,
            readonly body : rd.RouteUtil.ServerBody<DataT>,
            readonly headers : rd.RouteUtil.ServerHeader<DataT>,
        },
        readonly response : {
            readonly locals : LocalsT,
            readonly json : rd.RouteUtil.ServerExpectedResponse<DataT> extends never ?
                never :
                (response : rd.RouteUtil.ServerExpectedResponse<DataT>) => (
                    Response<RouteDataOf<DataT, LocalsT>["response"]>
                ),
        },
    }
);