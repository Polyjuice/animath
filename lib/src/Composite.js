export class Composite {
    friction = 0.06;
    mass = 0.001;
    hooksK = 0.0000001;
    gravity = { x: 0, y: 0.98 };
    attraction = 0;
    maxvel = Number.MAX_VALUE;
    particles = [];
    barriers = [];
    constraints = [];
    restLimit = 0.0001;
    name = "composite";
}
//# sourceMappingURL=Composite.js.map