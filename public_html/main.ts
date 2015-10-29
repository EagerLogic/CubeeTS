/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
/// <reference path="cubee.d.ts"/>

function start() {
    var div: HTMLDivElement = <HTMLDivElement>document.getElementById("cubeePanel");
    var cp = new cubee.CubeePanel(div);

    var vb = new cubee.HBox();

    vb.children.add(createP(cubee.Color.getRgbColor(0xff0000)));
    vb.children.add(createP(cubee.Color.getRgbColor(0x00ff00)));
    vb.children.add(createP(cubee.Color.getRgbColor(0x0000ff)));

    cp.rootComponent = vb;
}

function createP(color: cubee.Color) {
    var res = new cubee.Button();
    res.onClick.addListener((evt: MouseEvent) => {
        console.log(evt.clientX);
        console.log(evt.layerX);
        console.log(evt.offsetX);
        console.log(evt.pageX);
        console.log(evt.screenX);
        console.log(evt.x);
        console.log((<any>evt).clientX);
    });
//    res.width = 100;
//    res.height = 50;
    res.text = "Test Button";
    return res;
}


