var matMul4 = function(a,b){
    var result = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i = 0; i < 4; i++){//lateral
        for(var j = 0; j < 4; j++){//vertical
            for(var k = 0; k < 4; k++){//depth addition
                result[i*4+j] += a[i*4+k]*b[k*4+j];
            }
        }
    }
    return result;
};

var cos = Math.cos;
var sin = Math.sin;

var genYmat = function(a){
    return [
        cos(a),0,sin(a),0,
        0,1,0,0,
        -sin(a),0,cos(a),0,
        0,0,0,1
    ];
};

var genXmat = function(a){
    return [
        1,0,0,0,
        0,cos(a),-sin(a),0,
        0,sin(a),cos(a),0,
        0,0,0,1
    ];
};


var cube = document.querySelector(".cube");
console.log(cube);

var resultMatrix = [
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
];

var vx = 0;
var vy = 0;
var x0 = 0;
var y0 = 0;
var t0 = Date.now();
var down = false;

var mvx = 0;//mouse velocity
var mvy = 0;


document.body.addEventListener("mousedown",function(e){
    e.preventDefault();
    down = true;
    x0 = e.clientX;
    y0 = e.clientY;
    t0 = Date.now();
    mvx = 0;
    mvy = 0;
});

document.body.addEventListener("mousemove",function(e){
    e.preventDefault();
    if(!down)return false;
    var x = e.clientX;
    var y = e.clientY;
    var t = Date.now();
    var dt = (t - t0)/1000;
    var dx = x - x0;
    var dy = y - y0;
    if(dt === 0)return false;//infinity->nan bug, preventing being frozen
    mvx = dx/dt;
    mvy = dy/dt;
    console.log(dx,dy,mvx,mvy,dt);
    x0 = x;
    y0 = y;
    t0 = t;
});

document.body.addEventListener("mouseup",function(e){
    e.preventDefault();
    down = false;
});

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;
    if(down){
        if(Date.now() - t0 > 100){
            mvx = 0;
            mvy = 0;
            console.log("cancelled");
        }
        vx = vx+(mvx-vx)*dt*3;
        vy = vy+(mvy-vy)*dt*3;//friction part
    }
    var dx = dt*vx;
    var dy = dt*vy;
    console.log(dx,dy);
    //remember small angle approximation? sin(x) x>0 := x
    var ay = -dx/100//destination angle for the y axis
    var ax = dy/100//destination angle for the x axis
    var ymat = genYmat(ay);
    var xmat = genXmat(ax);
    resultMatrix = matMul4(matMul4(resultMatrix,ymat),xmat);
    console.log(resultMatrix);
    //then finally plug in all the values
    cube.style.transform = "matrix3d("+resultMatrix.join(",")+")";
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
