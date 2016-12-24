/**
 * Created by Administrator on 2016/12/24.
 */
function $(s) {
    return document.querySelectorAll(s)
}
var lis = $('#list li');
var size = 64;
var box = $("#box")[0];
var height,width;
var canvas =document.createElement("canvas");
var ctx = canvas.getContext("2d")
box.appendChild(canvas);
var Dots = [];
var line;

var mv = new MusicVisualizer({
    size:size,
    visualizer:draw
})

for(var i = 0;i < lis.length; i++)
{
    lis[i].onclick = function ()
    {
        for(var j = 0;j < lis.length; j++)
        {
            lis[j].className = "";
        }
        this.className = "selected";
        //load("/media/" + this.title)
        mv.play("/media/" + this.title);
    }
}

// var xhr = new XMLHttpRequest();
// var ac = new(window.AudioContext||window.webkitAudioContext)();
// var gainNode = ac[ac.createGain?"createGain":"createGainNode"]();
// gainNode.connect(ac.destination);
//
// var analyser = ac.createAnalyser();

// analyser.fftSize = size * 2;
// analyser.connect(gainNode);
//
//
// var source = null;
// var count = 0;
//-----------------canvas绘制音频数据------------------------------------


function random(m,n)
{
    return Math.round(Math.random()*(n - m) +m);
}

function getDots()
{
    Dots = [];
    for(var i = 0;i < size;i++)
    {
        var x = random(0,width);
        var y = random(0,height);
        var color = "rgba(" + random(0,255)+ "," +random(0,255) + "," +random(0,255) +",0.22)";
        Dots.push({x:x,y:y,dx:random(1,4),color:color,cap:0});
    }
}


function resize()
{
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height = height;
    canvas.width = width;
    line = ctx.createLinearGradient(0,0,0,height);
    line.addColorStop(0,"red");
    line.addColorStop(0.5,"yellow");
    line.addColorStop(1,"green");
    getDots();
}
resize();
window.onresize = resize;

function draw(arr)
{
    ctx.clearRect(0,0,width,height);
    var w = width /size;
    var cw = w * 0.6;
    var capH = cw > 10? 10 :cw;
    ctx.fillStyle = line;
    for(var i = 0;i < size;i++)
    {
        var o = Dots[i];
        if(draw.type == "column")
        {
            var h = arr[i] / 256 * height;
            ctx.fillRect(w * i ,height - h,cw,h);
            ctx.fillRect(w * i ,height - (o.cap+capH),cw,capH);
            o.cap--;
            if(o.cap < 0){o.cap = 0;}
            if(h>0 && o.cap < h + 20) {o.cap = h + 20 > height - capH?height - capH:h +20;}
        }
        else if(draw.type == "dot")
        {
            ctx.beginPath();
            var r = 10 + arr[i] /256 * (height > width ? width:height)/10;
            ctx.arc(o.x,o.y,r,0,Math.PI*2,true);
            var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
            g.addColorStop(0,"#fff");
            g.addColorStop(1,o.color);
            ctx.fillStyle = g;
            ctx.fill();
            o.x += o.dx;
            o.x = o.x > width ? 0:o.x;
            //ctx.strokeStyle = "#fff";
            //ctx.stroke();
        }

    }
}

draw.type = "column";
var types = $("#type li");
for(var i = 0;i < types.length;i++)
{
    types[i].onclick = function ()
    {
        for(var j = 0;j < types.length;j++)
        {
            types[j].className = "";
        }
        this.className = "selected";
        draw.type = this.getAttribute("data-type")
    }
}

//-------------Ajax-------------------------------------
// function load(url)
// {
//     var n = ++count;
//     source && source[source.stop?"stop":"noteOff"]();
//     xhr.abort();
//     xhr.open("GET",url);
//     xhr.responseType = "arraybuffer";  //把数据以二进制的形式缓存在这
//     xhr.onload = function ()
//     {
//         if(n != count)return;
//         ac.decodeAudioData(xhr.response,function (buffer)
//         {
//             if(n != count)return;
//             var bufferSource = ac.createBufferSource();
//             bufferSource.buffer = buffer;
//             bufferSource.connect(analyser);
//             //bufferSource.connect(gainNode);
//             //bufferSource.connect(ac.destination);
//             bufferSource[bufferSource.start?"start":"noteOn"](0);
//             source = bufferSource;
//         },function (err)
//         {
//             console.log(err)
//         })
//     }
//     xhr.send();
// }
// //--------------------------数据可视化------------------------------------
// function visualizer()
// {
//     var arr = new Uint8Array(analyser.frequencyBinCount);
//     requestAnimationFrame = window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame;
//     function v()
//     {
//         analyser.getByteFrequencyData(arr);
//         draw(arr);
//         requestAnimationFrame(v);
//         //console.log(arr);
//
//     }
//
//     requestAnimationFrame(v);
//
// }
// visualizer();

//--------------------------改变音量---------------------------
// function changeVolume(percent)
// {
//     gainNode.gain.value = percent * percent;
// }
$("#volume")[0].onchange = function ()
{
    mv.changeVolume(this.value/this.max);
}
$("#volume")[0].onchange();


