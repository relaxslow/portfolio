let canvas = document.getElementById("canvas");
let style=getComputedStyle(canvas);
let wid=style.getPropertyValue("width");
let hei=style.getPropertyValue("height");
wid=parseInt(wid.slice(0,wid.indexOf("px")));
hei=parseInt(hei.slice(0,hei.indexOf("px")));
canvas.width=wid;
canvas.height=hei;
var ctx = canvas.getContext('2d');
ctx.fillStyle = '#f00';
ctx.beginPath();
ctx.moveTo(0, 0);
ctx.lineTo(100, 50);
ctx.lineTo(50, 100);
ctx.lineTo(0, 90);
ctx.closePath();
ctx.fill();
let paint = false;
var clickX = [];
var clickY = [];
var clickDrag = [];

canvas.addEventListener("pointerdown", penDown, false);
canvas.addEventListener("pointermove", penMove, false);
canvas.addEventListener("pointerup", penUp, false);
function penDown(ev) {
    console.log(ev.pressure);
    var mouseX = ev.pageX - this.offsetLeft;
    var mouseY = ev.pageY - this.offsetTop;
    paint = true;
    addClick(mouseX, mouseY);
    redraw();
}
function penMove(ev) {
  
    if (paint) {
        var mouseX = ev.pageX - this.offsetLeft;
    var mouseY = ev.pageY - this.offsetTop;
        addClick(mouseX, mouseY, true);
        redraw();
    }
}
function penUp(ev) {
    paint=false;
}
function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}
function redraw(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the canvas
    
    ctx.strokeStyle = "#df4b26";
    ctx.lineJoin = "round";
    ctx.lineWidth = 5;
              
    for(var i=0; i < clickX.length; i++) {		
      ctx.beginPath();
      if(clickDrag[i] && i){
        ctx.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         ctx.moveTo(clickX[i]-1, clickY[i]);
       }
       ctx.lineTo(clickX[i], clickY[i]);
       ctx.closePath();
       ctx.stroke();
    }
  }
