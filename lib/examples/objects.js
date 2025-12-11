import { Composite } from "../src/Composite.js";
import { Constraint } from "../src/constraint.js";
import { Particle } from "../src/Particle.js";
import { vec1fn, vec1fromValues, vec2, vec2create, vec2fn, vec2normalize, vec2scale, vec2sub, vec3fn } from "../src/vec.js";
function v3(x, y, z) {
    return { x, y, z };
}
// ============================================
// 1D Object Factories
// ============================================
/**
 * Creates a chain of particles connected by springs in 1D space
 * @param origin Starting x position
 * @param spacing Distance between particles
 * @param segments Number of particles
 * @param stiffness Spring stiffness (0-1)
 * @param mass Mass of each particle (0 = fixed/pinned)
 */
export function createSpringChain1D(origin, spacing, segments, stiffness, mass = 1) {
    const composite = new Composite();
    composite.name = "spring-chain-1d";
    // Create particles
    for (let i = 0; i < segments; i++) {
        const x = origin + i * spacing;
        const particleMass = i === 0 ? 0 : mass; // First particle is anchored
        composite.particles.push(new Particle(vec1fn, vec1fromValues(x), particleMass));
    }
    // Create constraints between adjacent particles
    for (let i = 0; i < segments - 1; i++) {
        composite.constraints.push(new Constraint(vec1fn, composite.particles[i], composite.particles[i + 1], stiffness));
    }
    return composite;
}
/**
 * Creates a single spring with one anchored point and one free point
 * @param anchorX Fixed point x position
 * @param targetX Initial position of the free point
 * @param stiffness Spring stiffness
 * @param mass Mass of the free particle
 */
export function createAnchoredSpring1D(anchorX, targetX, stiffness, mass = 1) {
    const composite = new Composite();
    composite.name = "anchored-spring-1d";
    const anchor = new Particle(vec1fn, vec1fromValues(anchorX), 0); // mass=0 means fixed
    const target = new Particle(vec1fn, vec1fromValues(targetX), mass);
    composite.particles.push(anchor);
    composite.particles.push(target);
    composite.constraints.push(new Constraint(vec1fn, anchor, target, stiffness));
    return composite;
}
/**
 * Creates multiple parallel springs for comparison
 * @param startX Starting x position
 * @param y Visual y position (for rendering, stored separately)
 * @param length Rest length of each spring
 * @param count Number of springs
 * @param stiffnesses Array of stiffness values for each spring
 */
export function createSpringComparison1D(startX, length, count, stiffnesses) {
    const composites = [];
    for (let i = 0; i < count; i++) {
        const stiffness = stiffnesses[i] ?? 1;
        const composite = createAnchoredSpring1D(startX, startX + length * 1.5, stiffness, 1);
        composite.name = `spring-${i}-stiffness-${stiffness}`;
        composites.push(composite);
    }
    return composites;
}
// ============================================
// 3D Object Factories
// ============================================
/**
 * Creates a soft-body cube with particles at vertices and constraints along edges
 * @param origin Center position of the cube
 * @param size Side length of the cube
 * @param stiffness Spring stiffness
 */
export function createSoftCube3D(origin, size, stiffness) {
    const composite = new Composite();
    composite.name = "soft-cube-3d";
    const half = size / 2;
    // Create 8 vertices of the cube
    const vertices = [
        v3(origin.x - half, origin.y - half, origin.z - half), // 0: front-bottom-left
        v3(origin.x + half, origin.y - half, origin.z - half), // 1: front-bottom-right
        v3(origin.x + half, origin.y + half, origin.z - half), // 2: front-top-right
        v3(origin.x - half, origin.y + half, origin.z - half), // 3: front-top-left
        v3(origin.x - half, origin.y - half, origin.z + half), // 4: back-bottom-left
        v3(origin.x + half, origin.y - half, origin.z + half), // 5: back-bottom-right
        v3(origin.x + half, origin.y + half, origin.z + half), // 6: back-top-right
        v3(origin.x - half, origin.y + half, origin.z + half), // 7: back-top-left
    ];
    for (const v of vertices) {
        composite.particles.push(new Particle(vec3fn, v, 1));
    }
    // Edge constraints (12 edges of a cube)
    const edges = [
        // Front face
        [0, 1], [1, 2], [2, 3], [3, 0],
        // Back face
        [4, 5], [5, 6], [6, 7], [7, 4],
        // Connecting edges
        [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    for (const [a, b] of edges) {
        composite.constraints.push(new Constraint(vec3fn, composite.particles[a], composite.particles[b], stiffness));
    }
    // Face diagonals for stability (6 faces x 2 diagonals = 12)
    const faceDiagonals = [
        // Front face
        [0, 2], [1, 3],
        // Back face
        [4, 6], [5, 7],
        // Top face
        [2, 7], [3, 6],
        // Bottom face
        [0, 5], [1, 4],
        // Left face
        [0, 7], [3, 4],
        // Right face
        [1, 6], [2, 5],
    ];
    for (const [a, b] of faceDiagonals) {
        composite.constraints.push(new Constraint(vec3fn, composite.particles[a], composite.particles[b], stiffness));
    }
    // Space diagonals through the center (4 diagonals)
    const spaceDiagonals = [
        [0, 6], [1, 7], [2, 4], [3, 5]
    ];
    for (const [a, b] of spaceDiagonals) {
        composite.constraints.push(new Constraint(vec3fn, composite.particles[a], composite.particles[b], stiffness));
    }
    return composite;
}
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
export function createGrid3D(origin, width, height, depth, segmentsX, segmentsY, segmentsZ, stiffness) {
    const composite = new Composite();
    composite.name = "grid-3d";
    const dx = width / (segmentsX - 1);
    const dy = height / (segmentsY - 1);
    const dz = depth / (segmentsZ - 1);
    // Create particles in a 3D grid
    for (let z = 0; z < segmentsZ; z++) {
        for (let y = 0; y < segmentsY; y++) {
            for (let x = 0; x < segmentsX; x++) {
                const pos = v3(origin.x + x * dx, origin.y + y * dy, origin.z + z * dz);
                composite.particles.push(new Particle(vec3fn, pos, 1));
            }
        }
    }
    // Helper to get particle index
    const idx = (x, y, z) => z * segmentsY * segmentsX + y * segmentsX + x;
    // Create constraints along all axes
    for (let z = 0; z < segmentsZ; z++) {
        for (let y = 0; y < segmentsY; y++) {
            for (let x = 0; x < segmentsX; x++) {
                const current = idx(x, y, z);
                // X-axis constraint
                if (x < segmentsX - 1) {
                    composite.constraints.push(new Constraint(vec3fn, composite.particles[current], composite.particles[idx(x + 1, y, z)], stiffness));
                }
                // Y-axis constraint
                if (y < segmentsY - 1) {
                    composite.constraints.push(new Constraint(vec3fn, composite.particles[current], composite.particles[idx(x, y + 1, z)], stiffness));
                }
                // Z-axis constraint
                if (z < segmentsZ - 1) {
                    composite.constraints.push(new Constraint(vec3fn, composite.particles[current], composite.particles[idx(x, y, z + 1)], stiffness));
                }
            }
        }
    }
    return composite;
}
/**
 * Creates a chain of particles in 3D space
 */
export function createChain3D(start, end, segments, stiffness) {
    const composite = new Composite();
    composite.name = "chain-3d";
    const dx = (end.x - start.x) / (segments - 1);
    const dy = (end.y - start.y) / (segments - 1);
    const dz = (end.z - start.z) / (segments - 1);
    for (let i = 0; i < segments; i++) {
        const pos = v3(start.x + dx * i, start.y + dy * i, start.z + dz * i);
        // First particle is anchored
        const mass = i === 0 ? 0 : 1;
        composite.particles.push(new Particle(vec3fn, pos, mass));
    }
    for (let i = 0; i < segments - 1; i++) {
        composite.constraints.push(new Constraint(vec3fn, composite.particles[i], composite.particles[i + 1], stiffness));
    }
    return composite;
}
// ============================================
// 2D Object Factories (existing)
// ============================================
export function createContainer(composite, min, max) {
    console.log(min, max);
    let p1, p2, p3, p4;
    composite.particles.push(p1 = new Particle(vec2fn, min, 0));
    composite.particles.push(p2 = new Particle(vec2fn, { x: min.x, y: max.y }, 0));
    composite.particles.push(p3 = new Particle(vec2fn, max, 0));
    composite.particles.push(p4 = new Particle(vec2fn, { x: max.x, y: min.y }, 0));
    //    console.log(JSON.stringify(p1.pos), JSON.stringify(p2.pos), JSON.stringify(p3.pos), JSON.stringify(p4.pos));
    console.log(p1.pos, p2.pos, p3.pos, p4.pos);
    let top, right, bottom, left;
    composite.constraints.push(top = new Constraint(vec2fn, p1, p2, 0));
    composite.constraints.push(right = new Constraint(vec2fn, p2, p3, 0));
    composite.constraints.push(bottom = new Constraint(vec2fn, p3, p4, 0));
    composite.constraints.push(left = new Constraint(vec2fn, p4, p1, 0));
    composite.barriers.push(top);
    composite.barriers.push(right);
    composite.barriers.push(bottom);
    composite.barriers.push(left);
}
export function createParticles(composite, origin, segments, radius, mass) {
    composite.name = "particles";
    var stride = (2 * Math.PI) / segments;
    for (let i = 0; i < segments; ++i) {
        var theta = i * stride;
        let pos = vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius);
        let direction = vec2sub(vec2create(), pos, origin);
        let vel = vec2normalize(vec2create(), direction);
        vec2scale(vel, vel, 0.02);
        let p = new Particle(vec2fn, pos, mass);
        p.velocity = vel;
        composite.particles.push(p);
    }
    return composite;
}
export function createCloth(origin, width, height, segments, pinMod, stiffness) {
    var composite = new Composite();
    composite.name = "cloth";
    var xStride = width / segments;
    var yStride = height / segments;
    var x, y;
    for (y = 0; y < segments; ++y) {
        for (x = 0; x < segments; ++x) {
            var px = origin.x + x * xStride - width / 2 + xStride / 2;
            var py = origin.y + y * yStride - height / 2 + yStride / 2;
            composite.particles.push(new Particle(vec2fn, vec2(px, py)));
            if (x > 0)
                composite.constraints.push(new Constraint(vec2fn, composite.particles[y * segments + x], composite.particles[y * segments + x - 1], stiffness));
            if (y > 0)
                composite.constraints.push(new Constraint(vec2fn, composite.particles[y * segments + x], composite.particles[(y - 1) * segments + x], stiffness));
        }
    }
    // for (x = 0; x < segments; ++x) {
    //     if (x % pinMod == 0)
    //         composite.pin(x);
    // }
    return composite;
}
function addSegments(origin, center, segments, composite, stiffness, radius, depth, fold) {
    var stride = (2 * Math.PI) / segments;
    stride /= fold;
    depth--;
    let added = [];
    // particles
    for (let i = 0; i < segments; ++i) {
        var theta = i * stride;
        let pos = vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius);
        let p = new Particle(vec2fn, pos);
        composite.particles.push(p);
        added.push(p);
        if (depth > 0) {
            addSegments(pos, p, segments, composite, stiffness, radius / 2, depth, fold);
        }
    }
    // constraints
    for (const p of added) {
        let c = new Constraint(vec2fn, p, center, stiffness);
        composite.constraints.push(c);
        composite.barriers.push(c);
    }
}
export function createStar(origin, segments, depth, radius, stiffness, fold) {
    var composite = new Composite();
    var center = new Particle(vec2fn, origin);
    composite.particles.push(center);
    composite.name = "star";
    addSegments(origin, center, segments, composite, stiffness, radius, depth, fold);
    return composite;
}
export function createTire(origin, radius, segments, spokeStiffness, treadStiffness) {
    var stride = (2 * Math.PI) / segments;
    var i;
    var composite = new Composite();
    composite.name = "tire";
    // particles
    for (i = 0; i < segments; ++i) {
        var theta = i * stride;
        composite.particles.push(new Particle(vec2fn, vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius)));
    }
    var center = new Particle(vec2fn, origin);
    composite.particles.push(center);
    // constraints
    for (i = 0; i < segments; ++i) {
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], composite.particles[(i + 1) % segments], treadStiffness));
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], center, spokeStiffness));
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], composite.particles[(i + 5) % segments], treadStiffness));
    }
    return composite;
}
//# sourceMappingURL=objects.js.map