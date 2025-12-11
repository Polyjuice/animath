import { Constraint } from "./constraint.js";
import { Particle } from "./Particle.js";
import { vecx } from "./vec.js";
export declare class Composite<T extends vecx> {
    friction: number;
    mass: number;
    hooksK: number;
    gravity: {
        x: number;
        y: number;
    };
    attraction: number;
    maxvel: number;
    particles: Particle<T>[];
    barriers: Constraint<T>[];
    constraints: Constraint<T>[];
    restLimit: number;
    name: string;
}
