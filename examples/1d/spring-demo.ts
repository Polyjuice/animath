import { World } from "../../src/world.js";
import { vec1, vec1fn } from "../../src/vec.js";
import { Particle } from "../../src/Particle.js";
import { createSpringChain1D, createAnchoredSpring1D } from "../objects.js";
import { Composite } from "../../src/Composite.js";

// Create a 1D world
const world = new World<vec1>(vec1fn);

console.log("1D Spring Physics Demo");

// Get canvas and context
const artboard = document.querySelector("#artboard") as HTMLCanvasElement;
const rect = artboard.getBoundingClientRect();
artboard.width = rect.width * devicePixelRatio;
artboard.height = rect.height * devicePixelRatio;
const ctx = artboard.getContext("2d")!;
ctx.scale(devicePixelRatio, devicePixelRatio);

// Store visual Y positions for each composite (since 1D only has x)
const visualYPositions: Map<Composite<vec1>, number> = new Map();

// Create springs with different stiffness values for comparison
const stiffnessValues = [0.3, 0.5, 1, 2, 4];
const startX = 100;
const restLength = 100;

stiffnessValues.forEach((stiffness, index) => {
    const y = 80 + index * 100;
    const spring = createAnchoredSpring1D(startX, startX + restLength * 1.8, stiffness, 1);
    spring.name = `stiffness-${stiffness}`;
    spring.friction = 0.03;
    spring.hooksK = 0.0000005;
    spring.mass = 0.001;
    spring.restLimit = 0.00001;
    world.composites.push(spring);
    visualYPositions.set(spring, y);
});

// Create a longer chain demo
const chainY = 80 + stiffnessValues.length * 100 + 50;
const chain = createSpringChain1D(100, 40, 10, 1, 1);
chain.name = "chain";
chain.friction = 0.04;
chain.hooksK = 0.0000003;
chain.mass = 0.001;
chain.restLimit = 0.00001;
world.composites.push(chain);
visualYPositions.set(chain, chainY);

// Drag interaction state
let draggedParticle: Particle<vec1> | null = null;
let draggedComposite: Composite<vec1> | null = null;

// Find particle under mouse
function findParticleAt(mouseX: number, mouseY: number): { particle: Particle<vec1>, composite: Composite<vec1> } | null {
    const hitRadius = 15;

    for (const composite of world.composites) {
        const y = visualYPositions.get(composite)!;
        if (Math.abs(mouseY - y) > hitRadius) continue;

        for (const particle of composite.particles) {
            if (particle.mass === 0) continue; // Can't drag anchored particles
            if (Math.abs(mouseX - particle.pos.x) < hitRadius) {
                return { particle, composite };
            }
        }
    }
    return null;
}

// Mouse event handlers
artboard.addEventListener("mousedown", (e) => {
    const rect = artboard.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hit = findParticleAt(mouseX, mouseY);
    if (hit) {
        draggedParticle = hit.particle;
        draggedComposite = hit.composite;
        draggedParticle.mass = 0; // Pin while dragging
    }
});

artboard.addEventListener("mousemove", (e) => {
    if (draggedParticle) {
        const rect = artboard.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        draggedParticle.pos.x = mouseX;
        draggedParticle.velocity.x = 0;

        // Wake up the composite
        if (draggedComposite) {
            draggedComposite.maxvel = Number.MAX_VALUE;
        }
    }
});

artboard.addEventListener("mouseup", () => {
    if (draggedParticle) {
        draggedParticle.mass = 1; // Release
        draggedParticle = null;
        draggedComposite = null;
    }
});

artboard.addEventListener("mouseleave", () => {
    if (draggedParticle) {
        draggedParticle.mass = 1;
        draggedParticle = null;
        draggedComposite = null;
    }
});

// Animation loop
function drawFrame(time: number) {
    // Run physics
    world.run(100);

    // Clear canvas
    ctx.clearRect(0, 0, artboard.width / devicePixelRatio, artboard.height / devicePixelRatio);

    // Draw each composite
    for (const composite of world.composites) {
        const y = visualYPositions.get(composite)!;

        // Draw label
        ctx.fillStyle = "#666";
        ctx.font = "12px monospace";
        ctx.fillText(composite.name, 10, y - 25);

        // Draw rest position marker
        ctx.strokeStyle = "#ddd";
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        const anchor = composite.particles[0];
        const restX = anchor.pos.x + (composite.constraints[0]?.restingDistance ?? 0);
        ctx.moveTo(restX, y - 15);
        ctx.lineTo(restX, y + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw constraints (springs)
        ctx.strokeStyle = "#4a9eff";
        ctx.lineWidth = 2;
        for (const constraint of composite.constraints) {
            const x1 = constraint.pointA.pos.x;
            const x2 = constraint.pointB.pos.x;

            // Draw spring as zigzag
            drawSpring(ctx, x1, y, x2, y, 8);
        }

        // Draw particles
        for (const particle of composite.particles) {
            const x = particle.pos.x;
            const isAnchored = particle.mass === 0;
            const isDragged = particle === draggedParticle;

            ctx.beginPath();
            ctx.arc(x, y, isAnchored ? 6 : 10, 0, Math.PI * 2);

            if (isAnchored) {
                ctx.fillStyle = "#333";
            } else if (isDragged) {
                ctx.fillStyle = "#ff6b6b";
            } else {
                ctx.fillStyle = "#4a9eff";
            }
            ctx.fill();

            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Draw instructions
    ctx.fillStyle = "#999";
    ctx.font = "14px sans-serif";
    ctx.fillText("Drag the blue circles to stretch the springs", 10, 30);

    requestAnimationFrame(drawFrame);
}

// Draw a spring as a zigzag line
function drawSpring(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, coils: number) {
    const dx = x2 - x1;
    const amplitude = 8;

    ctx.beginPath();
    ctx.moveTo(x1, y1);

    // Start with a short straight segment
    const startSeg = 10;
    const endSeg = 10;
    const coilLength = dx - startSeg - endSeg;

    ctx.lineTo(x1 + startSeg, y1);

    // Draw coils
    for (let i = 0; i < coils; i++) {
        const segX = startSeg + (coilLength / coils) * (i + 0.5);
        const segY = (i % 2 === 0) ? -amplitude : amplitude;
        ctx.lineTo(x1 + segX, y1 + segY);
    }

    ctx.lineTo(x2 - endSeg, y2);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Start animation
requestAnimationFrame(drawFrame);
