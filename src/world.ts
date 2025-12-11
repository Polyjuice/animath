//import { vec2collider } from "./box-collision.js";
import { Composite } from "./Composite.js";
//import { Particle } from "./Particle.js";
import { vecfn, vecx } from "./vec.js";


export class World<T extends vecx> {

    //    attraction = -10;

    composites: Composite<T>[] = [];

    /**
     * @param vecfn Setts up the system to use 1d, 2d or 3d space
     */
    constructor(public vecfn: vecfn<T>) {
    }

    run(steps: number): number {
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
    /*
        integrate(particles: Particle<T>[], delta: number) {
            for (const particle of particles) {
                const mass = particle.mass;
                //if mass is zero, assume body is static / unmovable
                const vec = this.vecfn;
                if (mass === 0) {
                    this.vecfn.collide(particle, vec.regZero, vec.regNegativeInfinity, vec.regPositiveInfinity, 1);
                    vec.copy(particle.acc, vec.regZero);
                    return;
                }
                vec.add(particle.acc, particle.acc, this.gravity);
    
    
                //vec.scale(particle.acc, particle.acc, mass);
    
    
                //difference in positions
                //            vec.sub(vec.regVelocity, particle.pos, particle.prev);
                //dampen velocity
                //            vec.scale(vec.regVelocity, vec.regVelocity, this.friction);
                // handle custom collisions in 1D, 2D or 3D space
                //.collision(particle, vec.regVelocity);
                //set last position
                //   vec.copy(particle.prev, particle.pos);
                var tSqr = delta * delta;
    
                //integrate
                vec.scale(vec.regTmp, particle.acc, 0.5 * tSqr);
                vec.add(particle.pos, particle.pos, vec.regVelocity);
                vec.add(particle.pos, particle.pos, vec.regTmp);
    
                //reset acceleration
    
                //console.log("velocity", vec.regVelocity);
    
                vec.copy(particle.acc, vec.regZero);
            }
        }
    */

}

