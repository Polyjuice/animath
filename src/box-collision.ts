import { Particle } from "./Particle.js"
import { vec2, vec2copy, vec2fn, vec2scale, vec2mul, vec2sqrLen } from "./vec.js"

var negInfinity = vec2(-Infinity, -Infinity)
var posInfinity = vec2(Infinity, Infinity)
var ones = vec2(1, 1);
var reflect = { x: 0, y: 0 };
var EPSILON = 0.000001

export function vec2collider(p: Particle<vec2>, velocity: vec2, min: vec2, max: vec2, friction: number) {
    if (!min && !max)
        return

    //reset reflection 
    vec2copy(reflect, ones)

    min = min || negInfinity
    max = max || posInfinity

    //            const n = vecfn.dimensions
    const radius = 0;//p.radius;

    let hit = false

    //bounce and clamp
    for (let dim of vec2fn.dimensions) {
        if (typeof dim.get(min) === 'number' && dim.get(p.pos) - radius < (dim.get(min))) {
            dim.set(reflect, -1);
            dim.set(p.pos, dim.get(min) + radius);
            hit = true;
        }
        for (let key of vec2fn.dimensions) {
            if (typeof dim.get(max) === 'number' && dim.get(p.pos) + radius > (dim.get(max))) {
                dim.set(reflect, -1);
                dim.set(p.pos, (dim.get(max)) - radius);
                hit = true;
            }
        }

        //no bounce
        var len2 = vec2sqrLen(velocity)
        if (!hit || len2 <= EPSILON) {
            return;
        }

        var m = Math.sqrt(len2)
        if (m !== 0) {
            vec2scale(velocity, velocity, 1 / m);
        };

        //scale bounce by friction
        vec2scale(reflect, reflect, m * friction)

        //bounce back
        vec2mul(velocity, velocity, reflect)
    }
}
