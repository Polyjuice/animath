export class Constraint {
    vecfn;
    pointA;
    pointB;
    stiffness;
    restingDistance;
    constructor(vecfn, pointA, pointB, stiffness = 1, restingDistance) {
        this.vecfn = vecfn;
        this.pointA = pointA;
        this.pointB = pointB;
        this.stiffness = stiffness;
        this.restingDistance = (restingDistance !== undefined) ? restingDistance : vecfn.dist(this.pointA.pos, this.pointB.pos);
        //        this.restingDistance *= 0.7;
        //        console.log("rest", this.restingDistance);
    }
}
//# sourceMappingURL=constraint.js.map