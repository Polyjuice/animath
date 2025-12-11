export class World {
    vecfn;
    //    attraction = -10;
    composites = [];
    /**
     * @param vecfn Setts up the system to use 1d, 2d or 3d space
     */
    constructor(vecfn) {
        this.vecfn = vecfn;
    }
    run(steps) {
        let totalMaxvel = 0;
        for (let c of this.composites) {
            if (c.maxvel > c.restLimit) {
                c.maxvel = this.vecfn.solve(c, steps, c.particles, c.constraints, c.barriers);
                totalMaxvel = Math.max(c.maxvel, totalMaxvel);
                if (c.maxvel <= c.restLimit) {
                    console.log("rest", c.name, c.maxvel);
                }
            }
        }
        return totalMaxvel;
        //        for (let t = 0; t < 1000; t++) {
        // for (let i = 0; i < steps; i++) {
        //     this.integrate(this.composites[0].particles, 3 / steps);
        // }
        // for (const c of this.composites[0].constraints) {
        //     let posa = c.pointA.pos;
        //     let posb = c.pointB.pos;
        //     let dist = this.vecfn.dist(posa, posb);
        //     let stretch = dist / c.restingDistance;
        //     console.log("stretch", stretch);
        // }
        // for (const c of this.composites[0].constraints) {
        //     c.solve()
        // }
        //        }
    }
}
//# sourceMappingURL=world.js.map