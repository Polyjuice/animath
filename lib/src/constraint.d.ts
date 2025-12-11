import { vecfn, vecx } from "./vec.js";
import { Particle } from "./Particle.js";
export declare class Constraint<T extends vecx> {
    vecfn: vecfn<T>;
    pointA: Particle<T>;
    pointB: Particle<T>;
    stiffness: number;
    restingDistance: number;
    constructor(vecfn: vecfn<T>, pointA: Particle<T>, pointB: Particle<T>, stiffness?: number, restingDistance?: number);
}
