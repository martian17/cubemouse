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
var t0 = 0;
down = false;
document.body.addEventListener("mousedown",function(e){
    down = true;
    x0 = e.clientX;
    y0 = e.clientY;
    t0 = Date.now();
});

document.body.addEventListener("mousemove",function(e){
    if(!down)return false;
    var x = e.clientX;
    var y = e.clientY;
    var t = Date.now();
    var dt = (t - t0)/1000;
    var dx = x - x0;
    var dy = y - y0;
    vx = dx/dt;
    vy = dy/dt;
    x0 = x;
    y0 = y;
    t0 = t;
});

document.body.addEventListener("mouseup",function(e){
    down = false;
});

var start = 0;
var animate = function(t){
    if(start === 0)start = t;
    var dt = (t - start)/1000;
    start = t;
    
    var dx = dt*vx;
    var dy = dt*vy;
    //remember small angle approximation? sin(x) x>0 := x
    var ay = -dx/100//destination angle for the y axis
    var ax = dy/100//destination angle for the x axis
    var ymat = genYmat(ay);
    var xmat = genXmat(ax);
    resultMatrix = matMul4(matMul4(resultMatrix,ymat),xmat);
    //then finally plug in all the values
    cube.style.transform = "matrix3d("+resultMatrix.join(",")+")";
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
