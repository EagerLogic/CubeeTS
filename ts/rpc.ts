/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
namespace cubee {
    
    export function call<$P, $R>(url: string, method: string, param: $P, callback: RpcResult<$R>) {
        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    var json = this.responseText;
                    var result: $R = JSON.parse(json);
                    callback(this.status, result);
                } else {
                    callback(this.status, null);
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
    
    export interface RpcResult<$R> {
        (status: number, result: $R): void;
    }
    
}


