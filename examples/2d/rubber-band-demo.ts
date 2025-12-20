import { World } from "../../src/world.js";
import { vec2, vec2fn } from "../../src/vec.js";
import { Particle } from "../../src/Particle.js";
import { Constraint } from "../../src/constraint.js";
import { Composite } from "../../src/Composite.js";

// Configuration
const BREAKING_THRESHOLD = 1.5;  // 150% stretch breaks
const ANCHOR_POSITIONS = [
    { x: 200, y: 200 },
    { x: 500, y: 150 },
    { x: 550, y: 350 },
    { x: 150, y: 400 },
];

// Create world
const world = new World<vec2>(vec2fn);

// Setup canvas
const artboard = document.querySelector("#artboard") as HTMLCanvasElement;
const rect = artboard.getBoundingClientRect();
artboard.width = rect.width * devicePixelRatio;
artboard.height = rect.height * devicePixelRatio;
const ctx = artboard.getContext("2d")!;
ctx.scale(devicePixelRatio, devicePixelRatio);

// Create composite
const composite = new Composite<vec2>();
composite.name = "rubber-band";
composite.friction = 0.06;
composite.hooksK = 0.0000005;
composite.mass = 0.001;
composite.restLimit = 0.00001;

// Calculate center
const centerX = ANCHOR_POSITIONS.reduce((sum, p) => sum + p.x, 0) / ANCHOR_POSITIONS.length;
const centerY = ANCHOR_POSITIONS.reduce((sum, p) => sum + p.y, 0) / ANCHOR_POSITIONS.length;

// Create anchors
const anchors: Particle<vec2>[] = ANCHOR_POSITIONS.map(pos => {
    const anchor = new Particle<vec2>(vec2fn, { x: pos.x, y: pos.y }, 0);
    composite.particles.push(anchor);
    return anchor;
});

// Create draggable point at center
const dragPoint = new Particle<vec2>(vec2fn, { x: centerX, y: centerY }, 1);
composite.particles.push(dragPoint);

// Create breakable constraints from drag point to each anchor
const springs: Constraint<vec2>[] = [];
anchors.forEach((anchor, i) => {
    const spring = new Constraint<vec2>(vec2fn, anchor, dragPoint, 0.8);
    spring.breakingPoint = BREAKING_THRESHOLD;
    spring.breakMode = 'extension';
    spring.onBreak = (constraint, strain) => {
        console.log(`Spring ${i + 1} broke at ${(strain * 100).toFixed(0)}% strain!`);
    };
    springs.push(spring);
    composite.constraints.push(spring);
});

world.composites.push(composite);

// Drag state
let isDragging = false;

// Mouse handlers
artboard.addEventListener("mousedown", (e) => {
    const canvasRect = artboard.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;

    // Check if clicking near drag point
    const dist = Math.sqrt(
        Math.pow(mouseX - dragPoint.pos.x, 2) +
        Math.pow(mouseY - dragPoint.pos.y, 2)
    );

    if (dist < 25) {
        isDragging = true;
        dragPoint.mass = 0;
    }
});

artboard.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const canvasRect = artboard.getBoundingClientRect();
        dragPoint.pos.x = e.clientX - canvasRect.left;
        dragPoint.pos.y = e.clientY - canvasRect.top;
        dragPoint.velocity.x = 0;
        dragPoint.velocity.y = 0;
        composite.maxvel = Number.MAX_VALUE;
    }
});

artboard.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        dragPoint.mass = 1;
    }
});

artboard.addEventListener("mouseleave", () => {
    if (isDragging) {
        isDragging = false;
        dragPoint.mass = 1;
    }
});

// Reset button handler
document.querySelector("#reset")?.addEventListener("click", () => {
    // Reset all springs
    springs.forEach(spring => spring.repair());
    // Reset drag point position
    dragPoint.pos.x = centerX;
    dragPoint.pos.y = centerY;
    dragPoint.velocity.x = 0;
    dragPoint.velocity.y = 0;
    composite.maxvel = Number.MAX_VALUE;
});

// Get strain color (blue -> yellow -> red)
function getStrainColor(strain: number, broken: boolean): string {
    if (broken) return "#ff4444";

    const ratio = Math.min(strain / BREAKING_THRESHOLD, 1);
    if (ratio < 0.5) {
        const t = ratio * 2;
        const r = Math.round(74 + (255 - 74) * t);
        const g = Math.round(158 + (200 - 158) * t);
        const b = Math.round(255 * (1 - t));
        return `rgb(${r}, ${g}, ${b})`;
    } else {
        const t = (ratio - 0.5) * 2;
        const r = 255;
        const g = Math.round(200 * (1 - t));
        const b = 0;
        return `rgb(${r}, ${g}, ${b})`;
    }
}

// Render loop
function drawFrame(time: number) {
    world.run(100);

    const width = artboard.width / devicePixelRatio;
    const height = artboard.height / devicePixelRatio;

    ctx.clearRect(0, 0, width, height);

    // Draw springs
    springs.forEach((spring, i) => {
        const anchor = anchors[i];
        const color = getStrainColor(spring.currentStrain, spring.broken);

        // Draw spring line
        if (!spring.broken) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(anchor.pos.x, anchor.pos.y);
            ctx.lineTo(dragPoint.pos.x, dragPoint.pos.y);
            ctx.stroke();
        } else {
            // Draw broken spring as dashed
            ctx.strokeStyle = "#ff444466";
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 10]);
            ctx.beginPath();
            ctx.moveTo(anchor.pos.x, anchor.pos.y);
            ctx.lineTo(dragPoint.pos.x, dragPoint.pos.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Draw strain percentage near spring midpoint
        const midX = (anchor.pos.x + dragPoint.pos.x) / 2;
        const midY = (anchor.pos.y + dragPoint.pos.y) / 2;

        // Offset label perpendicular to spring direction
        const dx = dragPoint.pos.x - anchor.pos.x;
        const dy = dragPoint.pos.y - anchor.pos.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const offsetX = len > 0 ? (-dy / len) * 20 : 0;
        const offsetY = len > 0 ? (dx / len) * 20 : 0;

        ctx.fillStyle = color;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(
            spring.broken ? "BROKEN" : `${(spring.currentStrain * 100).toFixed(0)}%`,
            midX + offsetX,
            midY + offsetY
        );
    });

    // Draw anchors
    anchors.forEach((anchor, i) => {
        ctx.beginPath();
        ctx.arc(anchor.pos.x, anchor.pos.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = "#1e3a5f";
        ctx.fill();
        ctx.strokeStyle = "#4a9eff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Anchor number
        ctx.fillStyle = "#fff";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${i + 1}`, anchor.pos.x, anchor.pos.y);
    });

    // Draw drag point
    ctx.beginPath();
    ctx.arc(dragPoint.pos.x, dragPoint.pos.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = isDragging ? "#ff6b6b" : "#4a9eff";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw grip pattern on drag point
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(dragPoint.pos.x + i * 6, dragPoint.pos.y - 8);
        ctx.lineTo(dragPoint.pos.x + i * 6, dragPoint.pos.y + 8);
        ctx.stroke();
    }

    // Draw instructions
    ctx.fillStyle = "#999";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("Drag the center point to stretch the rubber bands", 20, 30);
    ctx.fillText(`Breaking threshold: ${(BREAKING_THRESHOLD * 100).toFixed(0)}% extension`, 20, 50);

    // Count broken springs
    const brokenCount = springs.filter(s => s.broken).length;
    if (brokenCount > 0) {
        ctx.fillStyle = "#ff6b6b";
        ctx.fillText(`${brokenCount} spring(s) broken - click Reset to repair`, 20, 70);
    }

    requestAnimationFrame(drawFrame);
}

requestAnimationFrame(drawFrame);
