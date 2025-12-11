import { World } from "../../src/world.js";
import { vec3, vec3fn } from "../../src/vec.js";
import { Particle } from "../../src/Particle.js";
import { createSoftCube3D, createChain3D } from "../objects.js";
import { Composite } from "../../src/Composite.js";

// Create a 3D world
const world = new World<vec3>(vec3fn);

console.log("3D Physics Demo");

// Get canvas and context
const artboard = document.querySelector("#artboard") as HTMLCanvasElement;
const rect = artboard.getBoundingClientRect();
artboard.width = rect.width * devicePixelRatio;
artboard.height = rect.height * devicePixelRatio;
const ctx = artboard.getContext("2d")!;
ctx.scale(devicePixelRatio, devicePixelRatio);

const width = rect.width;
const height = rect.height;

// Camera rotation
let rotationY = 0.5;
let rotationX = 0.3;
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

// Create a soft cube
const cube = createSoftCube3D({ x: 0, y: 0, z: 0 }, 150, 1);
cube.friction = 0.04;
cube.hooksK = 0.0000004;
cube.mass = 0.001;
cube.restLimit = 0.00001;
world.composites.push(cube);

// Create a chain hanging from the cube
const chain = createChain3D(
    { x: 0, y: 80, z: 0 },
    { x: 0, y: 250, z: 0 },
    8,
    1
);
chain.friction = 0.03;
chain.hooksK = 0.0000003;
chain.mass = 0.001;
chain.restLimit = 0.00001;
world.composites.push(chain);

// Give initial velocity to make things interesting
for (const p of cube.particles) {
    p.velocity.x = (Math.random() - 0.5) * 0.5;
    p.velocity.y = (Math.random() - 0.5) * 0.5;
    p.velocity.z = (Math.random() - 0.5) * 0.5;
}

// Project 3D point to 2D screen coordinates
function project(point: vec3): { x: number; y: number; scale: number } {
    // Apply rotation around Y axis
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    let x1 = point.x * cosY - point.z * sinY;
    let z1 = point.x * sinY + point.z * cosY;
    let y1 = point.y;

    // Apply rotation around X axis
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const y2 = y1 * cosX - z1 * sinX;
    const z2 = y1 * sinX + z1 * cosX;
    const x2 = x1;

    // Perspective projection
    const fov = 500;
    const distance = 600;
    const scale = fov / (distance + z2);

    return {
        x: width / 2 + x2 * scale,
        y: height / 2 + y2 * scale,
        scale: scale
    };
}

// Mouse event handlers for rotation
artboard.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

artboard.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        // Clamp X rotation to avoid flipping
        rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
});

artboard.addEventListener("mouseup", () => {
    isDragging = false;
});

artboard.addEventListener("mouseleave", () => {
    isDragging = false;
});

// Double-click to add impulse
artboard.addEventListener("dblclick", () => {
    for (const composite of world.composites) {
        composite.maxvel = Number.MAX_VALUE;
        for (const p of composite.particles) {
            if (p.mass > 0) {
                p.velocity.x += (Math.random() - 0.5) * 1;
                p.velocity.y += (Math.random() - 0.5) * 1;
                p.velocity.z += (Math.random() - 0.5) * 1;
            }
        }
    }
});

// Define cube edges for rendering
const cubeEdges = [
    // Front face
    [0, 1], [1, 2], [2, 3], [3, 0],
    // Back face
    [4, 5], [5, 6], [6, 7], [7, 4],
    // Connecting edges
    [0, 4], [1, 5], [2, 6], [3, 7],
];

// Animation loop
function drawFrame(time: number) {
    // Run physics
    world.run(100);

    // Auto-rotate slowly when not dragging
    if (!isDragging) {
        rotationY += 0.002;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid on the "floor"
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    const gridSize = 50;
    const gridExtent = 300;
    for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
        // Lines along X
        const p1 = project({ x: i, y: 200, z: -gridExtent });
        const p2 = project({ x: i, y: 200, z: gridExtent });
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Lines along Z
        const p3 = project({ x: -gridExtent, y: 200, z: i });
        const p4 = project({ x: gridExtent, y: 200, z: i });
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.stroke();
    }

    // Draw each composite
    for (const composite of world.composites) {
        // Draw constraints
        ctx.strokeStyle = "#4a9eff";
        ctx.lineWidth = 2;

        if (composite.name === "soft-cube-3d") {
            // Draw cube edges
            for (const [a, b] of cubeEdges) {
                const pA = composite.particles[a];
                const pB = composite.particles[b];
                const projA = project(pA.pos);
                const projB = project(pB.pos);

                ctx.beginPath();
                ctx.moveTo(projA.x, projA.y);
                ctx.lineTo(projB.x, projB.y);
                ctx.stroke();
            }
        } else {
            // Draw all constraints for other composites
            for (const constraint of composite.constraints) {
                const projA = project(constraint.pointA.pos);
                const projB = project(constraint.pointB.pos);

                ctx.beginPath();
                ctx.moveTo(projA.x, projA.y);
                ctx.lineTo(projB.x, projB.y);
                ctx.stroke();
            }
        }

        // Draw particles
        for (const particle of composite.particles) {
            const proj = project(particle.pos);
            const isAnchored = particle.mass === 0;
            const radius = Math.max(3, 8 * proj.scale);

            ctx.beginPath();
            ctx.arc(proj.x, proj.y, radius, 0, Math.PI * 2);

            if (isAnchored) {
                ctx.fillStyle = "#ff6b6b";
            } else {
                // Color based on depth (z)
                const depth = Math.min(1, Math.max(0, (particle.pos.z + 200) / 400));
                const r = Math.floor(74 + depth * 100);
                const g = Math.floor(158 - depth * 50);
                const b = 255;
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            }
            ctx.fill();

            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    // Draw instructions
    ctx.fillStyle = "#888";
    ctx.font = "14px sans-serif";
    ctx.fillText("Drag to rotate view | Double-click to add impulse", 20, 30);

    requestAnimationFrame(drawFrame);
}

// Start animation
requestAnimationFrame(drawFrame);
