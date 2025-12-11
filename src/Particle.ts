
import { vecfn, vecx } from "./vec.js";

export class Particle<T extends vecx> {
    pos: T;
    acc: T;
    velocity: T;

    constructor(public vecfn: vecfn<T>, position?: T, public mass = 1) {
        this.velocity = vecfn.create();
        this.acc = vecfn.create();
        //        this.prev = vecfn.create()
        this.pos = vecfn.create();
        if (position !== undefined) {
            vecfn.copy(this.pos, position);
            //vecfn.copy(this.prev, position);
        }
    }

    // addForce(v: T) {
    //     this.vecfn.sub(this.prev, this.prev, v)
    //     return this
    // }

    // place(v: T) {
    //     let vec = this.vecfn;
    //     vec.copy(this.pos, v)
    //     vec.copy(this.prev, v)
    //     return this
    // }
}