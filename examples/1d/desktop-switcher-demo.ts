import { World } from "../../src/world.js";
import { vec1, vec1fn } from "../../src/vec.js";
import { Particle } from "../../src/Particle.js";
import { Constraint } from "../../src/constraint.js";
import { Composite } from "../../src/Composite.js";

// Desktop state
let currentDesktop = 1;
const TOTAL_DESKTOPS = 3;
const DESKTOP_WIDTH = 300;
const BREAKING_THRESHOLD = 0.5;  // 50% stretch breaks the spring

// Create a 1D world
const world = new World<vec1>(vec1fn);

// Setup canvas
const artboard = document.querySelector("#artboard") as HTMLCanvasElement;
const rect = artboard.getBoundingClientRect();
artboard.width = rect.width * devicePixelRatio;
artboard.height = rect.height * devicePixelRatio;
const ctx = artboard.getContext("2d")!;
ctx.scale(devicePixelRatio, devicePixelRatio);

// Create the spring system
const composite = new Composite<vec1>();
composite.name = "desktop-switcher";
composite.friction = 0.08;
composite.hooksK = 0.0000008;
composite.mass = 0.001;
composite.restLimit = 0.00001;

// Anchor (center of current desktop)
function getAnchorX(): number {
    return DESKTOP_WIDTH / 2 + (currentDesktop - 1) * DESKTOP_WIDTH + 50;
}

const anchor = new Particle<vec1>(vec1fn, { x: getAnchorX() }, 0);
const dragPoint = new Particle<vec1>(vec1fn, { x: getAnchorX() }, 1);

composite.particles.push(anchor);
composite.particles.push(dragPoint);

// Create breakable constraint
// With restLength=100 and breakingPoint=0.5, spring breaks at 150px drag distance
const SPRING_REST_LENGTH = 100;
const spring = new Constraint<vec1>(vec1fn, anchor, dragPoint, 1.0, SPRING_REST_LENGTH);
spring.breakingPoint = BREAKING_THRESHOLD;
spring.breakMode = 'extension';

// Track if we've already handled this break
let breakHandled = false;

spring.onBreak = (constraint, strain) => {
    if (breakHandled) return;
    breakHandled = true;

    // Determine direction of switch
    const delta = dragPoint.pos.x - anchor.pos.x;
    if (delta > 0 && currentDesktop < TOTAL_DESKTOPS) {
        // Switching right
        currentDesktop++;
        commitDesktopSwitch('right');
    } else if (delta < 0 && currentDesktop > 1) {
        // Switching left
        currentDesktop--;
        commitDesktopSwitch('left');
    } else {
        // Can't switch further, just repair
        spring.repair();
        breakHandled = false;
    }
};

composite.constraints.push(spring);
world.composites.push(composite);

// State for gesture tracking
let isDragging = false;

function commitDesktopSwitch(direction: 'left' | 'right') {
    // Update anchor to new desktop position
    const newAnchorX = getAnchorX();
    anchor.pos.x = newAnchorX;

    // Repair the spring for next gesture
    setTimeout(() => {
        spring.repair();
        breakHandled = false;
    }, 100);
}

// Mouse event handlers
artboard.addEventListener("mousedown", (e) => {
    const canvasRect = artboard.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const centerY = (artboard.height / devicePixelRatio) / 2;

    // Check if clicking near drag point
    const dist = Math.sqrt(
        Math.pow(mouseX - dragPoint.pos.x, 2) +
        Math.pow((e.clientY - canvasRect.top) - centerY, 2)
    );

    if (dist < 30) {
        isDragging = true;
        dragPoint.mass = 0; // Pin while dragging
    }
});

artboard.addEventListener("mousemove", (e) => {
    if (isDragging) {
        const canvasRect = artboard.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        dragPoint.pos.x = mouseX;
        dragPoint.velocity.x = 0;
        composite.maxvel = Number.MAX_VALUE;
    }
});

artboard.addEventListener("mouseup", () => {
    if (isDragging) {
        isDragging = false;
        dragPoint.mass = 1; // Release - spring will pull back if not broken
        composite.maxvel = Number.MAX_VALUE; // Wake up the composite
    }
});

artboard.addEventListener("mouseleave", () => {
    if (isDragging) {
        isDragging = false;
        dragPoint.mass = 1;
        composite.maxvel = Number.MAX_VALUE; // Wake up the composite
    }
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

// Rendering
function drawFrame(time: number) {
    world.run(100);

    const width = artboard.width / devicePixelRatio;
    const height = artboard.height / devicePixelRatio;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Draw desktop backgrounds
    for (let i = 1; i <= TOTAL_DESKTOPS; i++) {
        const x = (i - 1) * DESKTOP_WIDTH + 50;
        const isActive = i === currentDesktop;

        ctx.fillStyle = isActive ? "#1e3a5f" : "#0f1a2e";
        ctx.fillRect(x, centerY - 100, DESKTOP_WIDTH, 200);

        ctx.strokeStyle = isActive ? "#4a9eff" : "#2a3a4e";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, centerY - 100, DESKTOP_WIDTH, 200);
    }

    // Draw desktop indicators
    for (let i = 1; i <= TOTAL_DESKTOPS; i++) {
        const x = DESKTOP_WIDTH / 2 + (i - 1) * DESKTOP_WIDTH + 50;
        const isActive = i === currentDesktop;

        // Desktop label
        ctx.fillStyle = isActive ? "#4a9eff" : "#666";
        ctx.font = isActive ? "bold 16px sans-serif" : "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`Desktop ${i}`, x, centerY - 120);

        // Dot indicator
        ctx.beginPath();
        ctx.arc(x, centerY + 130, isActive ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#4a9eff" : "#444";
        ctx.fill();
    }

    // Draw threshold indicators
    const thresholdDist = spring.restingDistance * BREAKING_THRESHOLD;
    const thresholdLeft = anchor.pos.x - thresholdDist;
    const thresholdRight = anchor.pos.x + thresholdDist;

    ctx.strokeStyle = "#ff444466";
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(thresholdLeft, centerY - 40);
    ctx.lineTo(thresholdLeft, centerY + 40);
    ctx.moveTo(thresholdRight, centerY - 40);
    ctx.lineTo(thresholdRight, centerY + 40);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw spring with strain coloring
    const springColor = getStrainColor(spring.currentStrain, spring.broken);

    if (!spring.broken) {
        ctx.strokeStyle = springColor;
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(anchor.pos.x, centerY);
        ctx.lineTo(dragPoint.pos.x, centerY);
        ctx.stroke();
    } else {
        // Draw broken spring as dashed
        ctx.strokeStyle = "#ff444488";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(anchor.pos.x, centerY);
        ctx.lineTo(dragPoint.pos.x, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw anchor
    ctx.beginPath();
    ctx.arc(anchor.pos.x, centerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.strokeStyle = "#666";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw drag point
    ctx.beginPath();
    ctx.arc(dragPoint.pos.x, centerY, 18, 0, Math.PI * 2);
    ctx.fillStyle = isDragging ? "#ff6b6b" : "#4a9eff";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw grip lines on drag point
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 2;
    for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(dragPoint.pos.x + i * 5, centerY - 6);
        ctx.lineTo(dragPoint.pos.x + i * 5, centerY + 6);
        ctx.stroke();
    }

    // Draw status
    ctx.fillStyle = "#999";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "left";

    const strainPercent = (spring.currentStrain * 100).toFixed(0);
    const thresholdPercent = (BREAKING_THRESHOLD * 100).toFixed(0);

    if (spring.broken) {
        ctx.fillStyle = "#ff6b6b";
        ctx.fillText("SWITCHED!", 20, 30);
    } else {
        ctx.fillText(`Strain: ${strainPercent}% / ${thresholdPercent}%`, 20, 30);
    }

    ctx.fillStyle = "#666";
    ctx.fillText("Drag horizontally to switch desktops", 20, 50);
    ctx.fillText("Release before threshold to snap back", 20, 70);

    requestAnimationFrame(drawFrame);
}

requestAnimationFrame(drawFrame);
