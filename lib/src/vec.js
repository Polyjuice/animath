const vec1dimensions = [{
        get: (v) => v.x,
        set: (v, a) => v.x = a
    }];
export const vec1fn = {
    dimensions: vec1dimensions,
    solve: vec1solve,
    collide: vec1collide,
    create: vec1create,
    add: vec1add,
    mul: vec1mul,
    sub: vec1sub,
    scale: vec1scale,
    copy: vec1copy,
    sqrLen: vec1sqrLen,
    fromValues: vec1fromValues,
    dot: vec1dot,
    dist: vec1dist,
    regScaled: vec1create(),
    regDelta: vec1create(),
    regVecolity: vec1create(),
    regTmp: vec1create(),
    regVelocity: vec1create(),
    regZero: vec1create(),
    regNegativeInfinity: { x: Number.NEGATIVE_INFINITY },
    regPositiveInfinity: { x: Number.POSITIVE_INFINITY }
};
export function vec1create() {
    var out = { x: 0 };
    return out;
}
export function vec1add(out, a, b) {
    out.x = a.x + b.x;
    return out;
}
export function vec1mul(out, a, b) {
    out.x = a.x * b.x;
    return out;
}
export function vec1sub(out, a, b) {
    out.x = a.x - b.x;
    return out;
}
export function vec1scale(out, a, b) {
    out.x = a.x * b;
    return out;
}
export function vec1copy(out, a) {
    out.x = a.x;
    return out;
}
export function vec1sqrLen(a) {
    const { x } = a;
    return x * x;
}
export function vec1fromValues(x) {
    return { x };
}
export function vec1dot(a, b) {
    return a.x * b.x;
}
export function vec1dist(a, b) {
    return Math.abs(a.x - b.x);
}
export const v1funcs = {
    create: vec1create,
    add: vec1add,
    mul: vec1mul,
    sub: vec1sub,
    scale: vec1scale,
    copy: vec1copy,
    sqrLen: vec1sqrLen,
    fromValues: vec1fromValues,
    dot: vec1dot,
    dist: vec1dist
};
const vec2dimensions = [{
        get: (v) => v.x,
        set: (v, a) => v.x = a
    },
    {
        get: (v) => v.y,
        set: (v, a) => v.y = a
    }];
export const vec2fn = {
    solve: vec2solve,
    collide: vec2collide,
    dimensions: vec2dimensions,
    create: vec2create,
    add: vec2add,
    mul: vec2mul,
    sub: vec2sub,
    scale: vec2scale,
    copy: vec2copy,
    sqrLen: vec2sqrLen,
    fromValues: vec2,
    dot: vec2dot,
    dist: vec2dist,
    regScaled: vec2create(),
    regDelta: vec2create(),
    regVecolity: vec2create(),
    regTmp: vec2create(),
    regVelocity: vec2create(),
    regZero: vec2create(),
    regNegativeInfinity: { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY },
    regPositiveInfinity: { x: Number.POSITIVE_INFINITY, y: Number.NEGATIVE_INFINITY }
};
export function vec2create() {
    var out = { x: 0, y: 0 };
    return out;
}
export function vec2add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    return out;
}
export function vec2mul(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    return out;
}
export function vec2sub(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
export function vec2scale(out, a, b) {
    out.x = a.x * b;
    out.y = a.y * b;
    return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
export function vec2copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    return out;
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
export function vec2sqrLen(a) {
    const { x, y } = a;
    return x * x + y * y;
}
export function vec2(x, y) {
    return { x, y };
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
export function vec2dot(a, b) {
    return a.x * b.x + a.y * b.y;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
export function vec2dist(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    return Math.sqrt(x * x + y * y);
}
// export const vec2fn: vecfn<vec2> = {
//     dimensions: vec2dimensions,
//     create: vec2create,
//     add: vec2add,
//     mul: vec2mul,
//     sub: vec2sub,
//     scale: vec2scale,
//     copy: vec2copy,
//     sqrLen: vec2sqrLen,
//     fromValues: vec2,
//     dot: vec2dot,
//     dist: vec2dist,
//     regScaled: vec2create(),
//     regDelta: vec2create(),
//     regVecolity: vec2create(),
//     regTmp: vec2create(),
//     regVelocity: vec2create(),
//     regZero: vec2create()
// };
const vec3dimensions = [{
        get: (v) => v.x,
        set: (v, a) => v.x = a
    },
    {
        get: (v) => v.y,
        set: (v, a) => v.y = a
    },
    {
        get: (v) => v.z,
        set: (v, a) => v.z = a
    }
];
export const vec3fn = {
    dimensions: vec3dimensions,
    solve: vec3solve,
    collide: vec3collide,
    create: vec3create,
    add: vec3add,
    mul: vec3mul,
    sub: vec3sub,
    scale: vec3scale,
    copy: vec3copy,
    sqrLen: vec3sqrLen,
    fromValues: vec3fromValues,
    dot: vec3dot,
    dist: vec3dist,
    regScaled: vec3create(),
    regDelta: vec3create(),
    regVecolity: vec3create(),
    regTmp: vec3create(),
    regVelocity: vec3create(),
    regZero: vec3create(),
    regNegativeInfinity: { x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: Number.NEGATIVE_INFINITY },
    regPositiveInfinity: { x: Number.POSITIVE_INFINITY, y: Number.NEGATIVE_INFINITY, z: Number.NEGATIVE_INFINITY }
};
export function vec3create() {
    return { x: 0, y: 0, z: 0 };
}
export function vec3add(out, a, b) {
    out.x = a.x + b.x;
    out.y = a.y + b.y;
    out.z = a.z + b.z;
    return out;
}
export function vec3mul(out, a, b) {
    out.x = a.x * b.x;
    out.y = a.y * b.y;
    out.z = a.z * b.z;
    return out;
}
export function vec3sub(out, a, b) {
    out.x = a.x - b.x;
    out.y = a.y - b.y;
    out.z = a.z - b.z;
    return out;
}
export function vec3scale(out, a, b) {
    out.x *= b;
    out.y *= b;
    out.z *= b;
    return out;
}
export function vec3copy(out, a) {
    out.x = a.x;
    out.y = a.y;
    out.z = a.z;
    return out;
}
export function vec3sqrLen(a) {
    const { x, y, z } = a;
    return x * x + y * y + z * z;
}
function vec3fromValues(x, y, z) {
    return { x, y, z };
}
function vec3dot(a, b) {
    return a.x * b.x + a.y * b.y + a.y * b.y;
}
export function vec3dist(a, b) {
    const x = b.x - a.x;
    const y = b.y - a.y;
    const z = b.z - a.z;
    return Math.sqrt(x * x + y * y + z * z);
}
export function vec2solve(config, iterations, particles, constraints, barriers) {
    let { hooksK, friction, mass, attraction } = config;
    let k = (hooksK / iterations);
    let f = 1 - (friction / iterations);
    let them = mass * iterations;
    // First pass to check if we break a spring
    for (const s of constraints) {
        const p0 = s.pointA;
        const p1 = s.pointB;
        const p0pos = p0.pos;
        const p1pos = p1.pos;
        const dx = p1pos.x - p0pos.x;
        const dy = p1pos.y - p0pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const stretch = (s.restingDistance - dist) * k;
        if ((stretch / k) > 10) {
            // console.log("im breaking!", stretch / k)
        }
    }
    let maxvel = 0;
    for (let i = 0; i < iterations; i++) {
        if (attraction !== 0) {
            // gravity/antigravity per particle
            for (const p0 of particles) {
                for (const p1 of particles) {
                    const p0pos = p0.pos;
                    const p1pos = p1.pos;
                    const dx = p1pos.x - p0pos.x;
                    const dy = p1pos.y - p0pos.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    if (len > 0) {
                        //console.log(len);
                        const force = (1 / (len * len)) * (p0.mass * p1.mass);
                        const dir = vec2(0, 0);
                        vec2normalize(dir, { x: dx, y: dy });
                        //console.log(dir);
                        const velocity = vec2(0, 0);
                        vec2scale(velocity, dir, (-force / 10) * attraction);
                        p0.velocity.x -= (velocity.x / iterations);
                        p0.velocity.y -= (velocity.y / iterations);
                        p1.velocity.x += (velocity.x / iterations);
                        p1.velocity.y += (velocity.y / iterations);
                    }
                }
            }
        }
        for (const s of constraints) {
            const p0 = s.pointA;
            const p1 = s.pointB;
            const p0mass = Math.max(p0.mass, 0.00001);
            const p1mass = Math.max(p1.mass, 0.00001);
            const p0pos = p0.pos;
            const p1pos = p1.pos;
            const p0vel = p0.velocity;
            const p1vel = p1.velocity;
            const dx = p1pos.x - p0pos.x;
            const dy = p1pos.y - p0pos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const stretch = (s.restingDistance - dist) * k * s.stiffness;
            let sx = dx * stretch;
            let sy = dy * stretch;
            let p0accx = -sx / (p0mass * them);
            let p0accy = -sy / (p0mass * them);
            let p1accx = +sx / (p1mass * them);
            let p1accy = +sy / (p1mass * them);
            p0vel.x = (p0vel.x + p0accx);
            p0vel.y = (p0vel.y + p0accy);
            p1vel.x = (p1vel.x + p1accx);
            p1vel.y = (p1vel.y + p1accy);
        }
        for (const b of barriers) {
            let start = b.pointA.pos;
            let end = b.pointB.pos;
            for (const p of particles) {
                let before = p.pos;
                let vel = p.velocity;
                let after = { x: p.pos.x + vel.x, y: p.pos.y + vel.y };
                //vec2grow(includingradius, before, includingradius, p.radius);
                vec2collide2(vel, start, end, before, after);
                // if (collision) {
                //     p.mass = 0;
                // }
            }
        }
        for (const p of particles) {
            p.pos.x += p.velocity.x;
            p.pos.y += p.velocity.y;
            let velx = p.velocity.x *= f;
            let vely = p.velocity.y *= f;
            maxvel = Math.max(maxvel, vec2dist(vec2fn.regZero, p.velocity));
        }
    }
    return maxvel;
}
export function vec1solve(config, iterations, particles, constraints, barriers) {
    return 0;
}
export function vec3solve(config, iterations, particles, constraints, barriers) {
    return 0;
}
export function vec1collide(p, velocity, min, max, friction) {
}
export function vec3collide(p, velocity, min, max, friction) {
}
export function vec2collide(p, velocity, min, max, friction) {
}
// export function vec2collide(p: Particle<vec2>, velocity: vec2, min: vec2, max: vec2, friction: number) {
//     //    const negInfinity = vec2(-Infinity, -Infinity)
//     //    const posInfinity = vec2(Infinity, Infinity)
//     const reflect = { x: 1, y: 1 };
//     const EPSILON = 0.000001
//     const radius = p.radius;
//     let hit = false
//     //bounce and clamp
//     for (let dim of vec2fn.dimensions) {
//         let n = dim.get(min);
//         if (dim.get(p.pos) - radius < n) {
//             dim.set(reflect, -1);
//             dim.set(p.pos, dim.get(min) + radius);
//             hit = true;
//         }
//     }
//     for (let dim of vec2fn.dimensions) {
//         let n = dim.get(max);
//         if (dim.get(p.pos) + radius > n) {
//             dim.set(reflect, -1);
//             dim.set(p.pos, n - radius);
//             hit = true;
//         }
//     }
//     //no bounce
//     var len2 = vec2sqrLen(velocity)
//     if (!hit || len2 <= EPSILON) {
//         return;
//     }
//     var m = Math.sqrt(len2)
//     if (m !== 0) {
//         vec2scale(velocity, velocity, 1 / m);
//     };
//     //scale bounce by friction
//     vec2scale(reflect, reflect, m * friction)
//     //bounce back
//     vec2mul(velocity, velocity, reflect)
// }
/**
  * Normalize a vec2
  *
  * @param {vec2} out the receiving vector
  * @param {vec2} a vector to normalize
  * @returns {vec2} out
  */
export function vec2normalize(out, a) {
    const x = a.x;
    const y = a.y;
    let len = x * x + y * y;
    if (len > 0) {
        len = 1 / Math.sqrt(len);
        out.x = x * len;
        out.y = y * len;
    }
    return out;
}
export function vec2grow(out, base, end, toadd) {
    // base 10,10
    // end 30, 30
    let ret = vec2create();
    let zerobased = vec2create();
    vec2sub(zerobased, end, base); // 20,20
    vec2normalize(ret, zerobased); // 1,1
    let len = vec2dist(base, end); // 28.3
    let newlen = len + toadd; // 31.3
    vec2scale(ret, zerobased, newlen / len); // 
    vec2add(ret, ret, base);
    vec2copy(out, ret);
    return out;
}
function vec2reflection(out, incomming, normal) {
    // 𝑟 = 𝑑 −  2(𝑑⋅𝑛)  𝑛
    // out.x = -incomming.x;
    // out.y = -incomming.y;
    // return out
    let len = vec2dist(vec2fn.regZero, normal);
    if (len > 1.001 || len < 0.999) {
        throw `len is ${len}`;
    }
    let par2 = 2 * vec2dot(incomming, normal);
    let par2n = vec2scale(vec2create(), normal, par2);
    vec2sub(out, incomming, par2n);
    return out;
}
function vec2surfacenormals(out1, start, stop) {
    let inpn = vec2create();
    let surface = vec2sub(vec2create(), start, stop);
    vec2normalize(inpn, surface);
    let dx = inpn.x;
    let dy = inpn.y;
    out1.x = -dy;
    out1.y = dx;
    return out1;
    // out2.x = dy;
    // out2.y = -dx;
}
function ccw(A, B, C) {
    return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
}
function vec2collide2(velocity, wallstart, wallend, b1, b2) {
    if (ccw(wallstart, b1, b2) != ccw(wallend, b1, b2) && ccw(wallstart, wallend, b1) != ccw(wallstart, wallend, b2)) {
        // Collision detected. Let's act
        let wallnormal = vec2surfacenormals(vec2create(), wallstart, wallend);
        vec2reflection(velocity, velocity, wallnormal);
        return true;
    }
    return false;
}
// console.log("intersect 0,50-100,50 : 50,0-50,100", intersect({ x: 0, y: 50 }, { x: 100, y: 50 }, { x: 50, y: 0 }, { x: 50, y: 100 }));
// console.log("intersect 50,0-100,0 : 10,0-10,100", intersect({ x: 50, y: 0 }, { x: 100, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 100 }));
// console.log("intersect 0,0-100,100 : 100,0-0,100", intersect({ x: 0, y: 0 }, { x: 100, y: 100 }, { x: 100, y: 0 }, { x: 0, y: 100 }));
let floor = vec2create();
let floornormal = vec2create();
let floor1 = { x: 0, y: 100 };
let floor2 = { x: 100, y: 100 };
vec2surfacenormals(floornormal, floor1, floor2);
let ray = { x: 10, y: -10 };
let reflect = vec2create();
vec2reflection(reflect, ray, floornormal);
console.log("normal", floornormal);
console.log("ray", ray);
console.log("reflect", reflect);
//# sourceMappingURL=vec.js.map