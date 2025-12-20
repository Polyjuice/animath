export class Constraint {
    vecfn;
    pointA;
    pointB;
    stiffness;
    restingDistance;
    // Breaking point properties
    broken = false;
    breakingPoint; // Strain threshold (e.g., 0.5 = 50% stretch)
    breakMode = 'extension';
    currentStrain = 0; // Updated each frame for visual feedback
    onBreak;
    constructor(vecfn, pointA, pointB, stiffness = 1, restingDistance) {
        this.vecfn = vecfn;
        this.pointA = pointA;
        this.pointB = pointB;
        this.stiffness = stiffness;
        this.restingDistance = (restingDistance !== undefined) ? restingDistance : vecfn.dist(this.pointA.pos, this.pointB.pos);
    }
    /** Reset the constraint to active state */
    repair() {
        this.broken = false;
    }
}
//# sourceMappingURL=constraint.js.map