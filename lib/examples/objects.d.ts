import { Composite } from "../src/Composite.js";
import { vec1, vec2, vec3 } from "../src/vec.js";
/**
 * Creates a chain of particles connected by springs in 1D space
 * @param origin Starting x position
 * @param spacing Distance between particles
 * @param segments Number of particles
 * @param stiffness Spring stiffness (0-1)
 * @param mass Mass of each particle (0 = fixed/pinned)
 */
export declare function createSpringChain1D(origin: number, spacing: number, segments: number, stiffness: number, mass?: number): Composite<vec1>;
/**
 * Creates a single spring with one anchored point and one free point
 * @param anchorX Fixed point x position
 * @param targetX Initial position of the free point
 * @param stiffness Spring stiffness
 * @param mass Mass of the free particle
 */
export declare function createAnchoredSpring1D(anchorX: number, targetX: number, stiffness: number, mass?: number): Composite<vec1>;
/**
 * Creates multiple parallel springs for comparison
 * @param startX Starting x position
 * @param y Visual y position (for rendering, stored separately)
 * @param length Rest length of each spring
 * @param count Number of springs
 * @param stiffnesses Array of stiffness values for each spring
 */
export declare function createSpringComparison1D(startX: number, length: number, count: number, stiffnesses: number[]): Composite<vec1>[];
/**
 * Creates a soft-body cube with particles at vertices and constraints along edges
 * @param origin Center position of the cube
 * @param size Side length of the cube
 * @param stiffness Spring stiffness
 */
export declare function createSoftCube3D(origin: vec3, size: number, stiffness: number): Composite<vec3>;
/**
 * Creates a 3D grid/cloth of particles
 * @param origin Top-left-front corner
 * @param width Width (x dimension)
 * @param height Height (y dimension)
 * @param depth Depth (z dimension)
 * @param segmentsX Segments along x
 * @param segmentsY Segments along y
 * @param segmentsZ Segments along z
 * @param stiffness Spring stiffness
 */
export declare function createGrid3D(origin: vec3, width: number, height: number, depth: number, segmentsX: number, segmentsY: number, segmentsZ: number, stiffness: number): Composite<vec3>;
/**
 * Creates a chain of particles in 3D space
 */
export declare function createChain3D(start: vec3, end: vec3, segments: number, stiffness: number): Composite<vec3>;
export declare function createContainer(composite: Composite<vec2>, min: vec2, max: vec2): void;
export declare function createParticles(composite: Composite<vec2>, origin: vec2, segments: number, radius: number, mass: number): Composite<vec2>;
export declare function createCloth(origin: vec2, width: number, height: number, segments: number, pinMod: number, stiffness: number): Composite<vec2>;
export declare function createStar(origin: vec2, segments: number, depth: number, radius: number, stiffness: number, fold: number): Composite<vec2>;
export declare function createTire(origin: vec2, radius: number, segments: number, spokeStiffness: number, treadStiffness: number): Composite<vec2>;
//# sourceMappingURL=objects.d.ts.map