const BACKGROUND = "#101010";
const FOREGROUND = "#00FFFF";

console.log(game);
game.width = 800;
game.height = 800;
const ctx = game.getContext("2d");
console.log(ctx);

function clear(){
    ctx.fillStyle = BACKGROUND; ctx.fillRect(0,0,game.width, game.height);
}

function point({x, y}){
    const size = 20;
    ctx.fillStyle = FOREGROUND;
    ctx.fillRect(x - size/2,y - size/2,size,size);
}

function line(p1,p2){
    ctx.lineWidth = 3;
    ctx.strokeStyle = FOREGROUND;
    ctx.beginPath();
    ctx.moveTo(p1.x,p1.y);
    ctx.lineTo(p2.x,p2.y);
    ctx.stroke();
}

function screen(p){
    return {
        x: (p.x + 1)/2*game.width,
        y: (1 - (p.y + 1)/2)*game.height,
    }
}

function project({x,y,z}){
    return{
        x: x/z,
        y: y/z,
    }
}

const centroids = new Array();
function center_of_gravity(){
    let x = y = z = 0;
    for(const face of fs){
        for(let i = 0; i < face.length; ++i){
            x += vs[face[i]].x;
            y += vs[face[i]].y;
            z += vs[face[i]].z;
        }
        x /= face.length;
        y /= face.length;
        z /= face.length;
       centroids.push({x,y,z});
        x = y = z = 0;
    }
}

const FPS = 60;
function translate_z({x, y, z}){
    return {x, y, z: z + dz};
}

function rotate_xz({x, y, z}, angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x*cos - z*sin,
        y,
        z: x*sin + z*cos,
    };
}

function rotate_xy({x, y, z}, angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: x*cos - y*sin,
        y: x*sin + y*cos,
        z,
    };
}

function rotate_yz({x, y , z} , angle){
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x, 
        y: y*cos - z*sin,
        z: y*sin + z*cos,
    };
}

//Cube
const vs = [
{x: 0.25, y: 0.25, z: 0.25},
{x: -0.25, y: 0.25, z: 0.25},
{x: -0.25, y: -0.25, z: 0.25}, 
{x: 0.25, y: -0.25, z: 0.25},

{x: 0.25, y: 0.25, z: -0.25},
{x: -0.25, y: 0.25, z: -0.25},
{x: -0.25, y: -0.25, z: -0.25}, 
{x: 0.25, y: -0.25, z: -0.25},
]

const fs = [
   [0, 1, 2, 3],
   [4, 5, 6, 7],
   [0, 4, 1, 5],
   [1, 5, 2, 6],
   [2, 6, 3, 7],
   [3, 7, 4, 0],
]

const fs2 = [
   [0, 1, 2, 3],
   [4, 5, 6, 7],
   [0, 4],
   [1, 5],
   [2, 6],
   [3, 7],
]

//Yugioh Card
//const vs = [
//    // ---- Card outer body (thin box) ----
//    {x:  0.6, y:  0.9, z:  0.02}, // 0 front
//    {x: -0.6, y:  0.9, z:  0.02}, // 1
//    {x: -0.6, y: -0.9, z:  0.02}, // 2
//    {x:  0.6, y: -0.9, z:  0.02}, // 3
//
//    {x:  0.6, y:  0.9, z: -0.02}, // 4 back
//    {x: -0.6, y:  0.9, z: -0.02}, // 5
//    {x: -0.6, y: -0.9, z: -0.02}, // 6
//    {x:  0.6, y: -0.9, z: -0.02}, // 7
//
//    // ---- Art frame (front face inset) ----
//    {x:  0.45, y:  0.45, z: 0.021}, // 8
//    {x: -0.45, y:  0.45, z: 0.021}, // 9
//    {x: -0.45, y: -0.1, z: 0.021}, // 10
//    {x:  0.45, y: -0.1, z: 0.021}, // 11
//
//    // ---- Name bar ----
//    {x:  0.45, y:  0.75, z: 0.021}, // 12
//    {x: -0.45, y:  0.75, z: 0.021}, // 13
//    {x: -0.45, y:  0.55, z: 0.021}, // 14
//    {x:  0.45, y:  0.55, z: 0.021}, // 15
//
//    // ---- Text box ----
//    {x:  0.45, y: -0.15, z: 0.021}, // 16
//    {x: -0.45, y: -0.15, z: 0.021}, // 17
//    {x: -0.45, y: -0.75, z: 0.021}, // 18
//    {x:  0.45, y: -0.75, z: 0.021}, // 19
//];
//
//const fs = [
//    // ---- Outer card box ----
//    [0, 1, 2, 3], // front
//    [4, 5, 6, 7], // back
//
//    [0, 4], [1, 5], [2, 6], [3, 7], // sides
//
//    // ---- Art frame ----
//    [8, 9, 10, 11],
//
//    // ---- Name bar ----
//    [12, 13, 14, 15],
//
//    // ---- Text box ----
//    [16, 17, 18, 19],
//];
let dz = 1;
let angle = 0;

function frame(){
    const dt = 1/FPS;
   // dz += 1 * dt; //Variable responsible for translation
    angle += Math.PI*dt;
    clear();
    //uncomment to highlight vertices
    if(centroids.length == 0 ){
        center_of_gravity();
    }

    for (const v of centroids){
       point(screen(project(translate_z(rotate_xz(v,angle),dz))));
    }

    //connect centroids
    //for (const f of fs2){
    //    for(let i = 0; i < fs2.length; ++i){
    //        const c = centroids[f[i]];
    //        const d = centroids[f[(i+1)%fs2.length]];
    //        line(screen(project(translate_z(rotate_xz(c,angle), dz)))
    //           ,screen(project(translate_z(rotate_xz(d,angle), dz))));
    //    }
    //}

    for (const f of fs){
        for(let i = 0; i < f.length; ++i){
            const a = vs[f[i]];
            const b = vs[f[(i+1)%f.length]];
            line(screen(project(translate_z(rotate_yz(a,angle), dz)))
               ,screen(project(translate_z(rotate_yz(b,angle), dz))));
        }
    }
    setTimeout(frame,1000/FPS);
}
setTimeout(frame,1000/FPS);
