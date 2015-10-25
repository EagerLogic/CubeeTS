/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/// <reference path="cubee.d.ts"/> 
function start() {
    var div = document.getElementById("cubeePanel");
    var cp = new cubee.CubeePanel(div);
    var p = new cubee.Panel();
    p.width = 200;
    p.height = 100;
    p.background = new cubee.ColorBackground(cubee.Color.getRgbColor(0xff4000));
    cp.rootComponent = p;
}
