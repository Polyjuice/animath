import { vecfn, vecx } from "./vec.js";
import { Particle } from "./Particle.js";
export type BreakMode = 'extension' | 'compression' | 'both';
export declare class Constraint<T extends vecx> {
    vecfn: vecfn<T>;
    pointA: Particle<T>;
    pointB: Particle<T>;
    stiffness: number;
    restingDistance: number;
    broken: boolean;
    breakingPoint?: number;
    breakMode: BreakMode;
    currentStrain: number;
    onBreak?: (constraint: Constraint<T>, strain: number) => void;
    constructor(vecfn: vecfn<T>, pointA: Particle<T>, pointB: Particle<T>, stiffness?: number, restingDistance?: number);
    /** Reset the constraint to active state */
    repair(): void;
}
//# sourceMappingURL=constraint.d.ts.map