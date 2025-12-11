export class Particle {
    vecfn;
    mass;
    pos;
    acc;
    velocity;
    constructor(vecfn, position, mass = 1) {
        this.vecfn = vecfn;
        this.mass = mass;
        this.velocity = vecfn.create();
        this.acc = vecfn.create();
        //        this.prev = vecfn.create()
        this.pos = vecfn.create();
        if (position !== undefined) {
            vecfn.copy(this.pos, position);
            //vecfn.copy(this.prev, position);
        }
    }
}
//# sourceMappingURL=Particle.js.map