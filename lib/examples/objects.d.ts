import { Composite } from "../src/Composite.js";
import { vec2 } from "../src/vec.js";
export declare function createContainer(composite: Composite<vec2>, min: vec2, max: vec2): void;
export declare function createParticles(composite: Composite<vec2>, origin: vec2, segments: number, radius: number, mass: number): Composite<vec2>;
export declare function createCloth(origin: vec2, width: number, height: number, segments: number, pinMod: number, stiffness: number): Composite<vec2>;
export declare function createStar(origin: vec2, segments: number, depth: number, radius: number, stiffness: number, fold: number): Composite<vec2>;
export declare function createTire(origin: vec2, radius: number, segments: number, spokeStiffness: number, treadStiffness: number): Composite<vec2>;
