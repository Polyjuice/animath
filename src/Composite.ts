import { Constraint } from "./constraint.js";
import { Particle } from "./Particle.js";
import { vec2, vecx } from "./vec.js"

export class Composite<T extends vecx> {
    friction = 0.06;
    mass = 0.001;
    hooksK = 0.0000001;
    gravity = { x: 0, y: 0.98 };
    attraction = 0;


    maxvel: number = Number.MAX_VALUE;
    particles: Particle<T>[] = [];
    barriers: Constraint<T>[] = [];
    constraints: Constraint<T>[] = [];
    restLimit = 0.0001;
    name = "composite";
}