import { Particle } from "./Particle.js";
import { vec2, vec2scale, vec2create, vec2fn, vec2add } from "./vec.js";
import { Constraint } from "./constraint.js";
import { World } from "./world.js";


var system: World<vec2>;
var vertices: any;
var constraints: any;


function tick(width: number, height: number, dt: number) {
    //constrain the system within the window bounds
    // system.min = vec2create();
    // system.max = vec2(width, height);
    //integrate the physics
    //system.integrate(vertices, dt / 1000);
    //perform constraint solving
    constraints.forEach(function (c: any) {
        return c.solve();
    });
}

function start(width: number, height: number) {
    //create a world with no gravity
    system = new World<vec2>(vec2fn);
    //create N particles with some initial momentum
    vertices = createVertices(500, width, height);
    //create some constraints that "tie" the points together
    constraints = createConstraints(vertices);
    //apply our "rotation" explode
    setTimeout(function () {
        rotate(vertices, 1);
    }, 1500);
    //then apply our gravity to make the points fall
    setTimeout(function () {
        //       system.gravity.y = 500;
    }, 2500);
}

function createVertices(n: number, width: number, height: number) {
    return Array(n).map(function (e, i, self) {
        var scale = random(10, 15)
        var a = i / (self.length - 1)
        var angle = a * Math.PI * 4

        var rot: vec2 = vec2(
            Math.cos(angle) * scale,
            Math.sin(angle) * scale
        );

        //create a new vertex near the middle
        var vert = new Particle<vec2>(vec2fn, vec2add(vec2create(), rot, vec2(width / 2, height / 2)));

        //add a force for when the particles first appear
        // vert.addForce(vec2scale(vec2create(), rot, 0.2 * a))

        //make one head heavier than the other
        if (i % 2 === 0)
            vert.mass = 2

        return vert
    })
}

function createConstraints(vertices: any) {
    //make our connections
    var points = [];
    for (var i = 0; i < vertices.length; i += 2) {
        points.push([vertices[i], vertices[(i + 1) % vertices.length]]);
    }
    //turn each into a constraint
    return points.map(function (p) {
        return new Constraint<vec2>(vec2fn, p[0], p[1], 0.05, 10);
    });
}
function rotate(vertices: any, stagger: any) {
    var delay = 0;
    //this adds a new timer for each vertex,
    //staggering the delay slightly
    //the effect will add a rotational force, hiding rectangles as it goes
    vertices.forEach(function (v: any, i: any, self: any) {
        setTimeout(function () {
            var scale = 50;
            //add in some more rotation for good measure
            var a = i / (self.length - 1);
            var angle = a * Math.PI * 40 + random(20, 30);
            var rot = vec2(Math.cos(angle) * scale, Math.sin(angle) * scale);
            v.addForce(vec2scale(rot, rot, -0.5 * a));
            v.rect = false;
        }, delay);
        delay += stagger || 0;
    });
}



function newArray(start: any, end: any) {
    var n0 = typeof start === 'number',
        n1 = typeof end === 'number'

    if (n0 && !n1) {
        end = start
        start = 0
    } else if (!n0 && !n1) {
        start = 0
        end = 0
    }

    start = start | 0
    end = end | 0
    var len = end - start
    if (len < 0)
        throw new Error('array length must be positive')

    var a = new Array(len)
    for (var i = 0, c = start; i < len; i++, c++)
        a[i] = c
    return a
}

function random(start: any, end: any) {
    var n0 = typeof start === 'number',
        n1 = typeof end === 'number'

    if (n0 && !n1) {
        end = start
        start = 0
    } else if (!n0 && !n1) {
        start = 0
        end = 1
    }
    return start + Math.random() * (end - start)
}


// export function cslamp(value: number, min: number, max: number) {
//     return min < max
//         ? (value < min ? min : value > max ? max : value)
//         : (value < max ? max : value > min ? min : value)
// }
