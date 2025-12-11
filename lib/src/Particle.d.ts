import { vecfn, vecx } from "./vec.js";
export declare class Particle<T extends vecx> {
    vecfn: vecfn<T>;
    mass: number;
    pos: T;
    acc: T;
    velocity: T;
    constructor(vecfn: vecfn<T>, position?: T, mass?: number);
}
//# sourceMappingURL=Particle.d.ts.map