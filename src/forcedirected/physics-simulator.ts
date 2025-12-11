/**
 * From ngraph.forcelayout
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */

import { generateCreateSpringForceFunction, generateCreateBodyFunction, generateQuadTreeFunction, generateBoundsFunction, generateCreateDragForceFunction, generateIntegratorFunction } from "./codeGenerators.js"
import { PhysicsSettings, PhysSpring, PhysBody } from "./types.js";
import { random as randomer } from "./random.js";
import { merge, JSONableObject } from "./helpers.js";
import { Graph, Vector } from "../core-graph-types.js";
import { partition } from "./partition.js";

var dimensionalCache: { [key: number]: any } = {};

/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
export class CPhysicsSimulator<BD, SD> implements Graph<PhysBody<BD>, PhysSpring<BD, SD>> {

  settings: PhysicsSettings;
  random = randomer(42);
  bodies: PhysBody<BD>[] = []; // Bodies in this simulation.
  springs: PhysSpring<BD, SD>[] = []; // Springs in this simulation.

  nextBodyId = 0;

  quadTree: any;
  private bounds: any
  private springForce: any;
  private dragForce: any;

  private integrate: any;
  private createBody: any;

  private totalMovement = 0; // how much movement we made on last step
  private forces: any[] = [];
  private forceMap = new Map();
  private iterationNumber = 0;

  protected dirty = false;


  from(spring: PhysSpring<BD, SD>): PhysBody<BD> {
    return spring.from;
  }
  to(spring: PhysSpring<BD, SD>): PhysBody<BD> {
    return spring.to;
  }
  edgeId(spring: PhysSpring<BD, SD>): string {
    return spring.id;
  }
  nodeId(body: PhysBody<BD>): string {
    return body.id;
  }
  sameNode(a: PhysBody<BD>, b: PhysBody<BD>): boolean {
    return a.id === b.id;
  }
  sameEdge(a: PhysSpring<BD, SD>, b: PhysSpring<BD, SD>): boolean {
    return a.id === b.id;
  }

  get nodes(): Iterable<PhysBody<BD>> {
    return this.bodies;
  }
  get edges(): Iterable<PhysSpring<BD, SD>> {
    return this.springs;
  }

  constructor(settings: Partial<PhysicsSettings>) {

    this.settings = merge<PhysicsSettings | undefined>(settings as unknown as JSONableObject, {
      /**
       * Ideal length for links (springs in physical model).
       */
      springLength: 10,

      /**
       * Hook's law coefficient. 1 - solid spring.
       */
      springCoefficient: 0.8,

      /**
       * Coulomb's law coefficient. It's used to repel nodes thus should be negative
       * if you make it positive nodes start attract each other :).
       */
      gravity: -12,

      /**
       * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
       * The closer it's to 1 the more nodes algorithm will have to go through.
       * Setting it to one makes Barnes Hut simulation no different from
       * brute-force forces calculation (each node is considered).
       */
      theta: 0.8,

      /**
       * Drag force coefficient. Used to slow down system, thus should be less than 1.
       * The closer it is to 0 the less tight system will be.
       */
      dragCoefficient: 0.9, // TODO: Need to rename this to something better. E.g. `dragCoefficient`

      /**
       * Default time step (dt) for forces integration
       */
      timeStep: 0.5,

      /**
       * Adaptive time step uses average spring length to compute actual time step:
       * See: https://twitter.com/anvaka/status/1293067160755957760
       */
      adaptiveTimeStepWeight: 0,

      /**
       * This parameter defines number of dimensions of the space where simulation
       * is performed. 
       */
      dimensions: 2,

      /**
       * In debug mode more checks are performed, this will help you catch errors
       * quickly, however for production build it is recommended to turn off this flag
       * to speed up computation.
       */
      debug: false
    })!;

    let factory = dimensionalCache[settings!.dimensions!];
    if (!factory) {
      const dimensions = settings!.dimensions!;
      // console.log('Creating new factory for dimensions: ' + dimensions);
      factory = {
        Body: generateCreateBodyFunction(dimensions, settings!.debug),
        createQuadTree: generateQuadTreeFunction(dimensions),
        createBounds: generateBoundsFunction(dimensions),
        createDragForce: generateCreateDragForceFunction(dimensions),
        createSpringForce: generateCreateSpringForceFunction(dimensions),
        integrate: generateIntegratorFunction(dimensions),
      };
      dimensionalCache[dimensions] = factory;
    }

    const Body = factory.Body;
    this.createBody = (pos: any) => new Body(pos);

    const random = randomer(42);

    this.quadTree = factory.createQuadTree(settings, random);
    this.bounds = factory.createBounds(this.bodies, settings, random);
    this.springForce = factory.createSpringForce(settings, random);
    this.dragForce = factory.createDragForce(settings);
    this.integrate = factory.integrate;

    this.totalMovement = 0; // how much movement we made on last step
    this.forces = [];
    this.forceMap = new Map();
    this.iterationNumber = 0;


    const nbodyForce = (/* iterationUmber */) => {
      if (this.bodies.length === 0) return;

      this.quadTree.insertBodies(this.bodies);
      var i = this.bodies.length;
      while (i--) {
        const body = this.bodies[i];
        if (!body.isPinned) {
          (body as any).reset();
          this.quadTree.updateBodyForce(body);
          this.dragForce.update(body);
        }
      }
    }

    const updateSpringForce = () => {
      var i = this.springs.length;
      while (i--) {
        this.springForce.update(this.springs[i]);
      }
    }

    this.addForce('nbody', nbodyForce);
    this.addForce('spring', updateSpringForce);
  }


  addForce(forceName: string, forceFunction: any) {
    if (this.forceMap.has(forceName)) throw new Error('Force ' + forceName + ' is already added');

    this.forceMap.set(forceName, forceFunction);
    this.forces.push(forceFunction);
  }


  removeForce(forceName: string) {
    var forceIndex = this.forces.indexOf(this.forceMap.get(forceName));
    if (forceIndex < 0) return;
    this.forces.splice(forceIndex, 1);
    this.forceMap.delete(forceName);
  }

  getForces() {
    // TODO: Should I trust them or clone the forces?
    return this.forceMap;
  }

  /**
   * Performs one step of force simulation.
   *
   * @returns {boolean} true if system is considered stable; False otherwise.
   */
  step() {
    if (this.dirty) {
      for (const spring of [...this.springs]) {
        if (spring.unreal) {
          this.removeSpring(spring);
        }
      }
      const parts = partition<any, any>(this);
      console.log("Connecting partitions with invisible springs", parts.length);
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; ++i) {
          const prevpart = [...parts[i - 1].nodes];
          const nextpart = [...parts[i].nodes];
          const prev = prevpart[prevpart.length - 1];
          const next = nextpart[nextpart.length - 1];
          const length = this.springs.length > 0 ? this.springs.reduce((acc, s) => acc + s.length, 0) / this.springs.length : this.settings!.springLength;
          const spring = this.addSpring(prev, next, length, this.settings!.springCoefficient);
          spring.unreal = true; // this is an invisible spring
        }
      }
      this.dirty = false;
    }

    for (var i = 0; i < this.forces.length; ++i) {
      this.forces[i](this.iterationNumber);
    }
    var movement = this.integrate(this.bodies, this.settings!.timeStep, this.settings!.adaptiveTimeStepWeight);
    this.iterationNumber += 1;
    return movement;
  }

  /**
   * Adds body to the system
   *
   * @param {ngraph.physics.primitives.Body} body physical body
   *
   * @returns {ngraph.physics.primitives.Body} added body
   */
  addBody(body: PhysBody<BD>): PhysBody<BD> {
    if (!body) {
      throw new Error('Body is required');
    }
    this.appendBody(body);

    return body;
  }

  appendBody(body: PhysBody<BD>) {
    this.dirty = true; // TODO: Should I mark simulator as dirty?
    this.bodies.push(body);
  }

  /**
   * Adds body to the system at given position
   *
   * @param {Object} pos position of a body
   *
   * @returns {ngraph.physics.primitives.Body} added body
   */
  addBodyAt(pos: Vector): PhysBody<BD> {
    if (!pos) {
      throw new Error('Body position is required');
    }
    var body = this.createBody(pos);
    body.id = `body ${this.nextBodyId++}`;
    this.appendBody(body);

    return body;
  }

  /**
   * Removes body from the system
   *
   * @param {ngraph.physics.primitives.Body} body to remove
   *
   * @returns {Boolean} true if body found and removed. falsy otherwise;
   */
  removeBody(body: PhysBody<BD>): boolean {

    var idx = this.bodies.indexOf(body);
    if (idx < 0) { return false }

    this.dirty = true; // TODO: Should I mark simulator as dirty?


    this.bodies.splice(idx, 1);
    if (this.bodies.length === 0) {
      this.bounds.reset();
    }
    return true;
  }

  appendSpring(spring: PhysSpring<BD, SD>) {
    this.dirty = true; // TODO: Should I mark simulator as dirty?
    this.springs.push(spring);
  }

  /**
   * Adds a spring to this simulation.
   *
   * @returns {Object} - a handle for a spring. If you want to later remove
   * spring pass it to removeSpring() method.
   */
  addSpring(body1: PhysBody<BD>, body2?: PhysBody<BD>, springLength?: number, springCoefficient = 1): PhysSpring<BD, SD> {
    if (!body1 || !body2) {
      throw new Error('Cannot add null spring to force simulator');
    }

    if (typeof springLength !== 'number') {
      springLength = -1; // assume global configuration
    }

    var spring = new Spring<BD, SD>(body1, body2, springLength, springCoefficient >= 0 ? springCoefficient : -1) as PhysSpring<BD, SD>;
    this.appendSpring(spring);

    // TODO: could mark simulator as dirty.
    return spring;
  }

  /**
   * Returns amount of movement performed on last step() call
   */
  getTotalMovement() {
    return this.totalMovement;
  }

  /**
   * Removes spring from the system
   *
   * @param {Object} spring to remove. Spring is an object returned by addSpring
   *
   * @returns {Boolean} true if spring found and removed. falsy otherwise;
   */
  removeSpring(spring: PhysSpring<BD, SD>): boolean {
    const idx = this.springs.indexOf(spring);
    if (idx > -1) {
      this.springs.splice(idx, 1);
      this.dirty = true; // TODO: Should I mark simulator as dirty?
      return true;
    }
    return false;
  }

  getBestNewBodyPosition(neighbors?: PhysBody<BD>[]) {
    return this.bounds.getBestNewPosition(neighbors);
  }

  getBoundingBox() {
    this.bounds.update();
    return this.bounds.box;
  }


  // TODO: Move the force specific stuff to force
  gravity(value?: number) {
    if (value !== undefined) {
      this.settings!.gravity = value;
      this.quadTree.options({ gravity: value });
      return value;
    }
    return this.settings!.gravity;

  }

  theta(value?: number) {
    if (value !== undefined) {
      this.settings!.theta = value;
      this.quadTree.options({ theta: value });
      return value;
    }
    return this.settings!.theta;
  }


}


/**
 * Represents a physical spring. Spring connects two bodies, has rest length
 * stiffness coefficient and optional weight
 */
export class Spring<BDA, SDA> {

  id: string;
  public data!: SDA;
  unreal = false;

  constructor(public from: PhysBody<BDA>, public to: PhysBody<BDA>, public length: number, public coefficient: number, data?: SDA) {
    this.id = `${from.id} to ${to.id}`;
    this.data = data || {} as SDA;
  }
}
