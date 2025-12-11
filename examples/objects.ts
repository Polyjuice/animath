import { Composite } from "../src/Composite.js";
import { Constraint } from "../src/constraint.js";
import { Particle } from "../src/Particle.js";
import { vec2, vec2create, vec2fn, vec2normalize, vec2scale, vec2sub } from "../src/vec.js"



export function createContainer(composite: Composite<vec2>, min: vec2, max: vec2) {
    console.log(min, max);
    let p1, p2, p3, p4: Particle<vec2>;
    composite.particles.push(p1 = new Particle<vec2>(vec2fn, min, 0));
    composite.particles.push(p2 = new Particle<vec2>(vec2fn, { x: min.x, y: max.y }, 0));
    composite.particles.push(p3 = new Particle<vec2>(vec2fn, max, 0));
    composite.particles.push(p4 = new Particle<vec2>(vec2fn, { x: max.x, y: min.y }, 0));

    //    console.log(JSON.stringify(p1.pos), JSON.stringify(p2.pos), JSON.stringify(p3.pos), JSON.stringify(p4.pos));
    console.log(p1.pos, p2.pos, p3.pos, p4.pos);


    let top, right, bottom, left: Constraint<vec2>;

    composite.constraints.push(top = new Constraint(vec2fn, p1, p2, 0));
    composite.constraints.push(right = new Constraint(vec2fn, p2, p3, 0));
    composite.constraints.push(bottom = new Constraint(vec2fn, p3, p4, 0));
    composite.constraints.push(left = new Constraint(vec2fn, p4, p1, 0));

    composite.barriers.push(top);
    composite.barriers.push(right);
    composite.barriers.push(bottom);
    composite.barriers.push(left);
}


export function createParticles(composite: Composite<vec2>, origin: vec2, segments: number, radius: number, mass: number) {
    composite.name = "particles";
    var stride = (2 * Math.PI) / segments;
    for (let i = 0; i < segments; ++i) {
        var theta = i * stride;
        let pos = vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius);
        let direction = vec2sub(vec2create(), pos, origin);
        let vel = vec2normalize(vec2create(), direction);
        vec2scale(vel, vel, 0.02);
        let p = new Particle<vec2>(vec2fn, pos, mass);
        p.velocity = vel;
        composite.particles.push(p);
    }
    return composite;
}

export function createCloth(origin: vec2, width: number, height: number, segments: number, pinMod: number, stiffness: number) {

    var composite = new Composite<vec2>();
    composite.name = "cloth";

    var xStride = width / segments;
    var yStride = height / segments;

    var x, y;
    for (y = 0; y < segments; ++y) {
        for (x = 0; x < segments; ++x) {
            var px = origin.x + x * xStride - width / 2 + xStride / 2;
            var py = origin.y + y * yStride - height / 2 + yStride / 2;
            composite.particles.push(new Particle<vec2>(vec2fn, vec2(px, py)));

            if (x > 0)
                composite.constraints.push(new Constraint<vec2>(vec2fn, composite.particles[y * segments + x], composite.particles[y * segments + x - 1], stiffness));

            if (y > 0)
                composite.constraints.push(new Constraint<vec2>(vec2fn, composite.particles[y * segments + x], composite.particles[(y - 1) * segments + x], stiffness));

        }
    }

    // for (x = 0; x < segments; ++x) {
    //     if (x % pinMod == 0)
    //         composite.pin(x);
    // }

    return composite;
}

function addSegments(origin: vec2, center: Particle<vec2>, segments: number, composite: Composite<vec2>, stiffness: number, radius: number, depth: number, fold: number) {
    var stride = (2 * Math.PI) / segments;
    stride /= fold;
    depth--;

    let added: Particle<vec2>[] = [];

    // particles
    for (let i = 0; i < segments; ++i) {
        var theta = i * stride;
        let pos = vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius);
        let p = new Particle<vec2>(vec2fn, pos);
        composite.particles.push(p);
        added.push(p);
        if (depth > 0) {
            addSegments(pos, p, segments, composite, stiffness, radius / 2, depth, fold);
        }
    }


    // constraints
    for (const p of added) {
        let c = new Constraint(vec2fn, p, center, stiffness);
        composite.constraints.push(c);
        composite.barriers.push(c);
    }

}

export function createStar(origin: vec2, segments: number, depth: number, radius: number, stiffness: number, fold: number) {

    var composite = new Composite<vec2>();
    var center = new Particle(vec2fn, origin);
    composite.particles.push(center);
    composite.name = "star";


    addSegments(origin, center, segments, composite, stiffness, radius, depth, fold);


    return composite;
}

export function createTire(origin: vec2, radius: number, segments: number, spokeStiffness: number, treadStiffness: number) {
    var stride = (2 * Math.PI) / segments;
    var i;

    var composite = new Composite<vec2>();
    composite.name = "tire";

    // particles
    for (i = 0; i < segments; ++i) {
        var theta = i * stride;
        composite.particles.push(new Particle<vec2>(vec2fn, vec2(origin.x + Math.cos(theta) * radius, origin.y + Math.sin(theta) * radius)));
    }

    var center = new Particle(vec2fn, origin);
    composite.particles.push(center);

    // constraints
    for (i = 0; i < segments; ++i) {
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], composite.particles[(i + 1) % segments], treadStiffness));
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], center, spokeStiffness))
        composite.constraints.push(new Constraint(vec2fn, composite.particles[i], composite.particles[(i + 5) % segments], treadStiffness));
    }

    return composite;
}
