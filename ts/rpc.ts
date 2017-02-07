/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace cubee {

    export class Rpc {

        static call<$P, $R>(url: string, method: string, param: $P, resultHandler: RpcResultHandler<$R>, errorHandler: RpcErrorHandler) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        var json = this.responseText;
                        var result: $R = JSON.parse(json);
                        resultHandler(result);
                    } else {
                        var json = this.responseText;
                        var errObj = JSON.parse(json);
                        var msg = errObj.error;
                        if (msg == null) {
                            msg = "<No error message>";
                        }
                        var error = new RpcError(this.status, msg);
                        errorHandler(error);
                    }
                }
            }
            req.open(method, url);
            if (param != null) {
                req.send(JSON.stringify(param));
            } else {
                req.send();
            }
        }
    }

    export interface RpcResultHandler<$R> {
        (result: $R): void;
    }

    export interface RpcErrorHandler {
        (error: RpcError): void;
    }

    export class RpcError {
        constructor(public status: number, public message: string) { }
    }

}


