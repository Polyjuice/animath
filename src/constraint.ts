import { vecfn, vecx } from "./vec.js"
import { Particle } from "./Particle.js"

export class Constraint<T extends vecx> {
    public restingDistance: number;

    constructor(public vecfn: vecfn<T>, public pointA: Particle<T>, public pointB: Particle<T>, public stiffness: number = 1, restingDistance?: number) {
        this.restingDistance = (restingDistance !== undefined) ? restingDistance : vecfn.dist(this.pointA.pos, this.pointB.pos)
        //        this.restingDistance *= 0.7;
        //        console.log("rest", this.restingDistance);
    }

    // solve() {
    //     let vec = this.vecfn;

    //     //distance formula
    //     var p1 = this.pointA,
    //         p2 = this.pointB,
    //         p1vec = p1.pos,
    //         p2vec = p2.pos,
    //         p1mass = p1.mass,
    //         p2mass = p2.mass;

    //     vec.sub(vec.regDelta, p1vec, p2vec);

    //     var d = Math.sqrt(vec.dot(vec.regDelta, vec.regDelta))

    //     //ratio for resting distance
    //     var restingRatio = d === 0 ? this.restingDistance : (this.restingDistance - d) / d
    //     var scalarP1,
    //         scalarP2

    //     //handle zero mass a little differently
    //     if (p1mass == 0 && p2mass == 0) {
    //         scalarP1 = 0
    //         scalarP2 = 0
    //         console.log("solve 1");
    //     } else if (p1mass == 0 && p2mass > 0) {
    //         scalarP1 = 0
    //         scalarP2 = this.stiffness
    //         console.log("solve 2");
    //     } else if (p1mass > 0 && p2mass == 0) {
    //         scalarP1 = this.stiffness
    //         scalarP2 = 0
    //         console.log("solve 3");
    //     } else {
    //         //invert mass quantities
    //         var im1 = 1.0 / p1mass
    //         var im2 = 1.0 / p2mass
    //         scalarP1 = (im1 / (im1 + im2)) * this.stiffness
    //         scalarP2 = this.stiffness - scalarP1
    //         console.log("solve 4", scalarP1, scalarP2);
    //     }

    //     //push/pull based on mass
    //     vec.scale(vec.regScaled, vec.regDelta, scalarP1 * restingRatio)
    //     vec.add(p1vec, p1vec, vec.regScaled)

    //     vec.scale(vec.regScaled, vec.regDelta, scalarP2 * restingRatio)
    //     vec.sub(p2vec, p2vec, vec.regScaled)

    //     return d
    // }

}
