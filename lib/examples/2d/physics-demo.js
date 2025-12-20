import { World } from "../../src/world.js";
import { vec2fn, vec2, vec2create } from "../../src/vec.js";
import { Particle } from "../../src/Particle.js";
import { createCloth, createTire, createStar, createParticles, createContainer } from "../objects.js";
let world = new World(vec2fn);
console.log("Hello World<vec2>");
const artboard = document.querySelector("#artboard");
const rect = artboard.getBoundingClientRect();
artboard.width = rect.width * devicePixelRatio;
artboard.height = rect.height * devicePixelRatio;
const ctx = artboard.getContext("2d");
ctx.scale(devicePixelRatio, devicePixelRatio);
let obj1 = new Particle(vec2fn, vec2create());
const points = [obj1];
let tire = createTire(vec2(125, 130), 100, 30, 0.1, 0.1);
let cloth = createCloth(vec2(380, 200), 300, 300, 5, 0, 1);
//let star = createStar(vec2(30, 650), 3, 3, 30, 3, 4);
let partsStar = createStar(vec2(300, 650), 3, 3, 100, 3, 1);
let parts = createParticles(partsStar, vec2(400, 500), 50, 30, 0.3);
tire.attraction = 0;
//star.attraction = -10;
cloth.attraction = -10;
parts.friction = 0.004;
//createContainer(tire, { x: 5, y: 5 }, { x: 550, y: 860 })
//createContainer(star, { x: 5, y: 5 }, { x: 550, y: 860 })
createContainer(parts, { x: 5, y: 5 }, { x: 550, y: 860 });
world.composites.push(tire);
world.composites.push(cloth);
//world.composites.push(star);
world.composites.push(parts);
window.requestAnimationFrame(drawFrame);
const debug = document.querySelector("#debug");
let x = 0, y = 0;
const precision = 1;
function round(n) {
    return Math.round(n * precision) / precision;
}
function dbg(obj, values) {
    let str = "";
    let first = true;
    for (let i = 0; i < values.length; i += 2) {
        str += `${first ? "" : ", "}${values[i]}:${round(values[i + 1])}`;
        first = false;
    }
    return `{ ${str} }`;
}
let counter = 0;
function drawFrame(time) {
    let maxvel = world.run(100);
    // if (maxvel > 0) {
    //     counter++;
    //     console.log("updating", counter)
    // }
    debug.innerHTML = world.composites[0].particles.map(e => dbg(e, ['x', e.pos.x, 'y', e.pos.y, 'mass', e.mass, 'acc.x', e.acc.x, 'acc.y', e.acc.y])).join(",\n");
    ctx.clearRect(0, 0, artboard.width, artboard.height);
    for (let c of world.composites) {
        for (const p of c.particles) {
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, 3, 0, 2 * Math.PI);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.stroke();
        }
        for (const b of c.barriers) {
            ctx.beginPath();
            ctx.moveTo(b.pointA.pos.x, b.pointA.pos.y);
            ctx.lineTo(b.pointB.pos.x, b.pointB.pos.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "red";
            ctx.fillStyle = "blue";
            ctx.fill();
            ctx.stroke();
        }
        for (const l of c.constraints) {
            ctx.beginPath();
            const pa = l.pointA.pos;
            const pb = l.pointB.pos;
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "white";
            ctx.stroke();
        }
    }
    window.requestAnimationFrame(drawFrame);
}
// artboard.appendChild(csvg("rect", { width: 200, height: 20, fill: '#000000' }));
// function csvg(tagName: string, values: { [key: string]: any }) {
//     const s = document.createElementNS("http://www.w3.org/2000/svg", tagName);
//     for (var key in values)
//         s.setAttributeNS(null, key, values[key]);
//     return s;
// }
//# sourceMappingURL=physics-demo.js.map