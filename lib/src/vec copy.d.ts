import { Constraint } from "./constraint.js";
import { Particle } from "./Particle.js";
export type vecx = vec1 | vec2 | vec3;
export type vec1 = {
    x: number;
};
export type vec2 = {
    x: number;
    y: number;
};
export type vec3 = {
    x: number;
    y: number;
    z: number;
};
type GetSetDim<T extends vecx> = {
    set: (v: T, a: number) => void;
    get: (v: T) => number;
};
export type vecfn<T extends vecx> = {
    dimensions: Iterable<GetSetDim<T>>;
    solve(particles: Particle<T>[], constraints: Constraint<T>[], barriers: Constraint<T>[], iterations: number, attraction: number): number;
    collide(point: Particle<T>, velocity: T, min: T, max: T, friction: number): void;
    create(): T;
    add(out: T, a: T, b: T): T;
    mul(out: T, a: T, b: T): T;
    sub(out: T, a: T, b: T): T;
    scale(out: T, a: T, b: number): T;
    copy(out: T, a: T): T;
    sqrLen(a: T): number;
    fromValues(x: number, y?: number, z?: number): T;
    dot(a: T, b: T): number;
    dist(a: T, b: T): number;
    /**
     * Temporary variables used as registers to avoid uneccessary allocations
     */
    regScaled: T;
    regDelta: T;
    regVecolity: T;
    regTmp: T;
    regVelocity: T;
    regZero: T;
    regPositiveInfinity: T;
    regNegativeInfinity: T;
};
export declare const vec1fn: vecfn<vec1>;
export declare function vec1create(): {
    x: number;
};
export declare function vec1add(out: vec1, a: vec1, b: vec1): vec1;
export declare function vec1mul(out: vec1, a: vec1, b: vec1): vec1;
export declare function vec1sub(out: vec1, a: vec1, b: vec1): vec1;
export declare function vec1scale(out: vec1, a: vec1, b: number): vec1;
export declare function vec1copy(out: vec1, a: vec1): vec1;
export declare function vec1sqrLen(a: vec1): number;
export declare function vec1fromValues(x: number): {
    x: number;
};
export declare function vec1dot(a: vec2, b: vec2): number;
export declare function vec1dist(a: vec2, b: vec2): number;
export declare const v1funcs: {
    create: typeof vec1create;
    add: typeof vec1add;
    mul: typeof vec1mul;
    sub: typeof vec1sub;
    scale: typeof vec1scale;
    copy: typeof vec1copy;
    sqrLen: typeof vec1sqrLen;
    fromValues: typeof vec1fromValues;
    dot: typeof vec1dot;
    dist: typeof vec1dist;
};
export declare const vec2fn: vecfn<vec2>;
export declare function vec2create(): {
    x: number;
    y: number;
};
export declare function vec2add(out: vec2, a: vec2, b: vec2): vec2;
export declare function vec2mul(out: vec2, a: vec2, b: vec2): vec2;
export declare function vec2sub(out: vec2, a: vec2, b: vec2): vec2;
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
export declare function vec2scale(out: vec2, a: vec2, b: number): vec2;
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
export declare function vec2copy(out: vec2, a: vec2): vec2;
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
export declare function vec2sqrLen(a: vec2): number;
export declare function vec2(x: number, y: number): {
    x: number;
    y: number;
};
/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
export declare function vec2dot(a: vec2, b: vec2): number;
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
export declare function vec2dist(a: vec2, b: vec2): number;
export declare const vec3fn: vecfn<vec3>;
export declare function vec3create(): {
    x: number;
    y: number;
    z: number;
};
export declare function vec3add(out: vec3, a: vec3, b: vec3): vec3;
export declare function vec3mul(out: vec3, a: vec3, b: vec3): vec3;
export declare function vec3sub(out: vec3, a: vec3, b: vec3): vec3;
export declare function vec3scale(out: vec3, a: vec3, b: number): vec3;
export declare function vec3copy(out: vec3, a: vec3): vec3;
export declare function vec3sqrLen(a: vec3): number;
export declare function vec3dist(a: vec3, b: vec3): number;
export declare function vec2solve(particles: Particle<vec2>[], constraints: Constraint<vec2>[], barriers: Constraint<vec2>[], iterations: number, attraction: number): number;
export declare function vec1solve(particles: Particle<vec1>[], constraints: Constraint<vec1>[], barriers: Constraint<vec1>[], iterations: number): number;
export declare function vec3solve(particles: Particle<vec3>[], constraints: Constraint<vec3>[], barriers: Constraint<vec3>[], iterations: number): number;
export declare function vec1collide(p: Particle<vec1>, velocity: vec1, min: vec1, max: vec1, friction: number): void;
export declare function vec3collide(p: Particle<vec3>, velocity: vec3, min: vec3, max: vec3, friction: number): void;
export declare function vec2collide(p: Particle<vec2>, velocity: vec2, min: vec2, max: vec2, friction: number): void;
/**
  * Normalize a vec2
  *
  * @param {vec2} out the receiving vector
  * @param {vec2} a vector to normalize
  * @returns {vec2} out
  */
export declare function vec2normalize(out: vec2, a: vec2): vec2;
export declare function vec2grow(out: vec2, base: vec2, end: vec2, toadd: number): vec2;
export {};
//# sourceMappingURL=vec%20copy.d.ts.map