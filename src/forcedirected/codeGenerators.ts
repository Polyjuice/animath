/**
 * From ngraph.forcelayout
 * Copyright (c) 2013 - 2025, Andrei Kashcha
 */


//////////////////////////////////////////////////
//// createPatternBuilder.js
//////////////////////////////////////////////////


export function createPatternBuilder(dimension: number) {

  return (template: string, config?: any) => {
    let indent = (config && config.indent) || 0;
    let join = (config && config.join !== undefined) ? config.join : '\n';
    let indentString = Array(indent + 1).join(' ');
    let buffer: string[] = [];
    for (let i = 0; i < dimension; ++i) {
      let variableName = getVariableName(i);
      let prefix = (i === 0) ? '' : indentString;
      buffer.push(prefix + template.replace(/{var}/g, variableName));
    }
    return buffer.join(join);
  }
};

//////////////////////////////////////////////////
//// generateBounds.js
//////////////////////////////////////////////////



export function generateBoundsFunction(dimension: number) {
  let code = generateBoundsFunctionBody(dimension);
  return new Function('bodies', 'settings', 'random', code);
}

function generateBoundsFunctionBody(dimension: number) {
  let pattern = createPatternBuilder(dimension);

  let code = `
  var boundingBox = {
    ${pattern('min_{var}: 0, max_{var}: 0,', { indent: 4 })}
  };

  return {
    box: boundingBox,

    update: updateBoundingBox,

    reset: resetBoundingBox,

    getBestNewPosition: function (neighbors) {
      var ${pattern('base_{var} = 0', { join: ', ' })};

      if (neighbors.length) {
        for (var i = 0; i < neighbors.length; ++i) {
          let neighborPos = neighbors[i].pos;
          ${pattern('base_{var} += neighborPos.{var};', { indent: 10 })}
        }

        ${pattern('base_{var} /= neighbors.length;', { indent: 8 })}
      } else {
        ${pattern('base_{var} = (boundingBox.min_{var} + boundingBox.max_{var}) / 2;', { indent: 8 })}
      }

      var springLength = settings.springLength;
      return {
        ${pattern('{var}: base_{var} + (random.nextDouble() - 0.5) * springLength,', { indent: 8 })}
      };
    }
  };

  function updateBoundingBox() {
    var i = bodies.length;
    if (i === 0) return; // No bodies - no borders.

    ${pattern('var max_{var} = -Infinity;', { indent: 4 })}
    ${pattern('var min_{var} = Infinity;', { indent: 4 })}

    while(i--) {
      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
      var bodyPos = bodies[i].pos;
      ${pattern('if (bodyPos.{var} < min_{var}) min_{var} = bodyPos.{var};', { indent: 6 })}
      ${pattern('if (bodyPos.{var} > max_{var}) max_{var} = bodyPos.{var};', { indent: 6 })}
    }

    ${pattern('boundingBox.min_{var} = min_{var};', { indent: 4 })}
    ${pattern('boundingBox.max_{var} = max_{var};', { indent: 4 })}
  }

  function resetBoundingBox() {
    ${pattern('boundingBox.min_{var} = boundingBox.max_{var} = 0;', { indent: 4 })}
  }
`;
  return code;
}



//////////////////////////////////////////////////
//// generateCreateBody.js
//////////////////////////////////////////////////


export function generateCreateBodyFunction(dimension: number, debugSetters: any) {
  let code = generateCreateBodyFunctionBody(dimension, debugSetters);
  let { Body } = (new Function(code))();
  return Body;
}

function generateCreateBodyFunctionBody(dimension: number, debugSetters: any) {
  let code = `
${getVectorCode(dimension, debugSetters)}
${getBodyCode(dimension)}
return {Body: Body, Vector: Vector};
`;
  return code;
}

function getBodyCode(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let variableList = pattern('{var}', { join: ', ' });
  return `
function Body(${variableList}) {
  this.isPinned = false;
  this.pos = new Vector(${variableList});
  this.force = new Vector();
  this.velocity = new Vector();
  this.mass = 1;
  this.data = {
    id: "",
    isUsed: false,
  }

  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.reset = function() {
  this.force.reset();
  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.setPosition = function (${variableList}) {
  ${pattern('this.pos.{var} = {var} || 0;', { indent: 2 })}
};`;
}

function getVectorCode(dimension: number, debugSetters: any) {
  let pattern = createPatternBuilder(dimension);
  let setters = '';
  if (debugSetters) {
    setters = `${pattern("\n\
   var v{var};\n\
Object.defineProperty(this, '{var}', {\n\
  set: function(v) { \n\
    if (!Number.isFinite(v)) throw new Error('Cannot set non-numbers to {var}');\n\
    v{var} = v; \n\
  },\n\
  get: function() { return v{var}; }\n\
});")}`;
  }

  let variableList = pattern('{var}', { join: ', ' });
  return `function Vector(${variableList}) {
  ${setters}
    if (typeof arguments[0] === 'object') {
      // could be another vector
      let v = arguments[0];
      ${pattern('if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");', { indent: 4 })}
      ${pattern('this.{var} = v.{var};', { indent: 4 })}
    } else {
      ${pattern('this.{var} = typeof {var} === "number" ? {var} : 0;', { indent: 4 })}
    }
  }
  
  Vector.prototype.reset = function () {
    ${pattern('this.{var} = ', { join: '' })}0;
  };`;
}


//////////////////////////////////////////////////
//// generateCreateDragForce.js
//////////////////////////////////////////////////


export function generateCreateDragForceFunction(dimension: number) {
  let code = generateCreateDragForceFunctionBody(dimension);
  return new Function('options', code);
}

function generateCreateDragForceFunctionBody(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    update: function(body) {
      ${pattern('body.force.{var} -= options.dragCoefficient * body.velocity.{var};', { indent: 6 })}
    }
  };
`;
  return code;
}

//////////////////////////////////////////////////
//// generateCreateSpringForce.js
//////////////////////////////////////////////////

export function generateCreateSpringForceFunction(dimension: number) {
  let code = generateCreateSpringForceFunctionBody(dimension);
  return new Function('options', 'random', code);
}

function generateCreateSpringForceFunctionBody(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

  return {
    /**
     * Updates forces acting on a spring
     */
    update: function (spring) {
      const body1 = spring.from;
      const body2 = spring.to;
      const length = spring.length < 0 ? options.springLength : spring.length;
      ${pattern('var d{var} = body2.pos.{var} - body1.pos.{var};', { indent: 6 })}
      let r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});

      if (r === 0) {
        ${pattern('d{var} = (random.nextDouble() - 0.5) / 50;', { indent: 8 })}
        r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});
      }

      const d = r - length;
      const coefficient = ((spring.coefficient > 0) ? spring.coefficient : options.springCoefficient) * d / r;

      ${pattern('body1.force.{var} += coefficient * d{var}', { indent: 6 })};
      body1.springCount += 1;
      body1.springLength += r;

      ${pattern('body2.force.{var} -= coefficient * d{var}', { indent: 6 })};
      body2.springCount += 1;
      body2.springLength += r;
    }
  };
`;
  return code;
}

//////////////////////////////////////////////////
//// generateIntegrator.js
//////////////////////////////////////////////////

export function generateIntegratorFunction(dimension: number) {
  let code = generateIntegratorFunctionBody(dimension);
  return new Function('bodies', 'timeStep', 'adaptiveTimeStepWeight', code);
}

function generateIntegratorFunctionBody(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  var length = bodies.length;
  if (length === 0) return 0;

  ${pattern('var d{var} = 0, t{var} = 0;', { indent: 2 })}

  for (var i = 0; i < length; ++i) {
    var body = bodies[i];
    if (body.isPinned) continue;

    if (adaptiveTimeStepWeight && body.springCount) {
      timeStep = (adaptiveTimeStepWeight * body.springLength/body.springCount);
    }

    var coeff = timeStep / body.mass;

    ${pattern('body.velocity.{var} += coeff * body.force.{var};', { indent: 4 })}
    ${pattern('var v{var} = body.velocity.{var};', { indent: 4 })}
    var v = Math.sqrt(${pattern('v{var} * v{var}', { join: ' + ' })});

    if (v > 1) {
      // We normalize it so that we move within timeStep range. 
      // for the case when v <= 1 - we let velocity to fade out.
      ${pattern('body.velocity.{var} = v{var} / v;', { indent: 6 })}
    }

    ${pattern('d{var} = timeStep * body.velocity.{var};', { indent: 4 })}

    ${pattern('body.pos.{var} += d{var};', { indent: 4 })}

    ${pattern('t{var} += Math.abs(d{var});', { indent: 4 })}
  }

  return (${pattern('t{var} * t{var}', { join: ' + ' })})/length;
`;
  return code;
}


//////////////////////////////////////////////////
//// generateQuadTree.js
//////////////////////////////////////////////////


export function generateQuadTreeFunction(dimension: number) {
  let code = generateQuadTreeFunctionBody(dimension);
  return (new Function(code))();
}

function generateQuadTreeFunctionBody(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let quadCount = Math.pow(2, dimension);

  let code = `
${getInsertStackCode()}
${getQuadNodeCode(dimension)}
${isSamePosition(dimension)}
${getChildBodyCode(dimension)}
${setChildBodyCode(dimension)}

function createQuadTree(options, random) {
  options = options || {};
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  return {
    insertBodies: insertBodies,

    /**
     * Gets root node if it is present
     */
    getRoot: function() {
      return root;
    },

    updateBodyForce: update,

    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
${assignQuads('      node.')}
      node.body = null;
      node.mass = ${pattern('node.mass_{var} = ', { join: '' })}0;
      ${pattern('node.min_{var} = node.max_{var} = ', { join: '' })}0;
    } else {
      node = new QuadNode();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue;
    var v;
    ${pattern('var d{var};', { indent: 4 })}
    var r; 
    ${pattern('var f{var} = 0;', { indent: 4 })}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        ${pattern('d{var} = body.pos.{var} - sourceBody.pos.{var};', { indent: 8 })}
        r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${pattern('d{var} = (random.nextDouble() - 0.5) / 50;', { indent: 10 })}
          r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});
        }

        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        ${pattern('f{var} += v * d{var};', { indent: 8 })}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${pattern('d{var} = node.mass_{var} / node.mass - sourceBody.pos.{var};', { indent: 8 })}
        r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${pattern('d{var} = (random.nextDouble() - 0.5) / 50;', { indent: 10 })}
          r = Math.sqrt(${pattern('d{var} * d{var}', { join: ' + ' })});
        }
        // If s / r < θ, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${getVariableName(0)} - node.min_${getVariableName(0)}) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          ${pattern('f{var} += v * d{var};', { indent: 10 })}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${runRecursiveOnChildren()}
        }
      }
    }

    ${pattern('sourceBody.force.{var} += f{var};', { indent: 4 })}
  }

  function insertBodies(bodies) {
    ${pattern('var {var}min = Number.MAX_VALUE;', { indent: 4 })}
    ${pattern('var {var}max = Number.MIN_VALUE;', { indent: 4 })}
    var i = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      var pos = bodies[i].pos;
      ${pattern('if (pos.{var} < {var}min) {var}min = pos.{var};', { indent: 6 })}
      ${pattern('if (pos.{var} > {var}max) {var}max = pos.{var};', { indent: 6 })}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${pattern('if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;', { indent: 4 })}

    currentInCache = 0;
    root = newNode();
    ${pattern('root.min_{var} = {var}min;', { indent: 4 })}
    ${pattern('root.max_{var} = {var}min + maxSideLength;', { indent: 4 })}

    i = bodies.length - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        ${pattern('var {var} = body.pos.{var};', { indent: 8 })}
        node.mass += body.mass;
        ${pattern('node.mass_{var} += body.mass * {var};', { indent: 8 })}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${pattern('var min_{var} = node.min_{var};', { indent: 8 })}
        ${pattern('var max_{var} = (min_{var} + node.max_{var}) / 2;', { indent: 8 })}

${assignInsertionQuadIndex(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${pattern('child.min_{var} = min_{var};', { indent: 10 })}
          ${pattern('child.max_{var} = max_{var};', { indent: 10 })}
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${pattern('var d{var} = (node.max_{var} - node.min_{var}) * offset;', { indent: 12 })}

            ${pattern('oldBody.pos.{var} = node.min_{var} + d{var};', { indent: 12 })}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
}
return createQuadTree;

`;
  return code;


  function assignInsertionQuadIndex(indentCount: number) {
    let insertionCode: string[] = [];
    let indent = Array(indentCount + 1).join(' ');
    for (let i = 0; i < dimension; ++i) {
      insertionCode.push(indent + `if (${getVariableName(i)} > max_${getVariableName(i)}) {`);
      insertionCode.push(indent + `  quadIdx = quadIdx + ${Math.pow(2, i)};`);
      insertionCode.push(indent + `  min_${getVariableName(i)} = max_${getVariableName(i)};`);
      insertionCode.push(indent + `  max_${getVariableName(i)} = node.max_${getVariableName(i)};`);
      insertionCode.push(indent + `}`);
    }
    return insertionCode.join('\n');
    // if (x > max_x) { // somewhere in the eastern part.
    //   quadIdx = quadIdx + 1;
    //   left = right;
    //   right = node.right;
    // }
  }

  function runRecursiveOnChildren() {
    let indent = Array(11).join(' ');
    let recursiveCode: string[] = [];
    for (let i = 0; i < quadCount; ++i) {
      recursiveCode.push(indent + `if (node.quad${i}) {`);
      recursiveCode.push(indent + `  queue[pushIdx] = node.quad${i};`);
      recursiveCode.push(indent + `  queueLength += 1;`);
      recursiveCode.push(indent + `  pushIdx += 1;`);
      recursiveCode.push(indent + `}`);
    }
    return recursiveCode.join('\n');
    // if (node.quad0) {
    //   queue[pushIdx] = node.quad0;
    //   queueLength += 1;
    //   pushIdx += 1;
    // }
  }

  function assignQuads(indent: string) {
    // this.quad0 = null;
    // this.quad1 = null;
    // this.quad2 = null;
    // this.quad3 = null;
    let quads: string[] = [];
    for (let i = 0; i < quadCount; ++i) {
      quads.push(`${indent}quad${i} = null;`);
    }
    return quads.join('\n');
  }
}

function isSamePosition(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  return `
  function isSamePosition(point1, point2) {
    ${pattern('var d{var} = Math.abs(point1.{var} - point2.{var});', { indent: 2 })}
  
    return ${pattern('d{var} < 1e-8', { join: ' && ' })};
  }  
`;
}

function setChildBodyCode(dimension: number) {
  var quadCount = Math.pow(2, dimension);
  return `
function setChild(node, idx, child) {
  ${setChildBody()}
}`;
  function setChildBody() {
    let childBody: string[] = [];
    for (let i = 0; i < quadCount; ++i) {
      let prefix = (i === 0) ? '  ' : '  else ';
      childBody.push(`${prefix}if (idx === ${i}) node.quad${i} = child;`);
    }

    return childBody.join('\n');
    // if (idx === 0) node.quad0 = child;
    // else if (idx === 1) node.quad1 = child;
    // else if (idx === 2) node.quad2 = child;
    // else if (idx === 3) node.quad3 = child;
  }
}

function getChildBodyCode(dimension: number) {
  return `function getChild(node, idx) {
${getChildBody()}
  return null;
}`;

  function getChildBody() {
    let childBody: string[] = [];
    let quadCount = Math.pow(2, dimension);
    for (let i = 0; i < quadCount; ++i) {
      childBody.push(`  if (idx === ${i}) return node.quad${i};`);
    }

    return childBody.join('\n');
    // if (idx === 0) return node.quad0;
    // if (idx === 1) return node.quad1;
    // if (idx === 2) return node.quad2;
    // if (idx === 3) return node.quad3;
  }
}

function getQuadNodeCode(dimension: number) {
  let pattern = createPatternBuilder(dimension);
  let quadCount = Math.pow(2, dimension);
  var quadNodeCode = `
function QuadNode() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain bodies:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${assignQuads('  this.')}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${pattern('this.mass_{var} = 0;', { indent: 2 })}

  // bounding box coordinates
  ${pattern('this.min_{var} = 0;', { indent: 2 })}
  ${pattern('this.max_{var} = 0;', { indent: 2 })}
}
`;
  return quadNodeCode;

  function assignQuads(indent: string) {
    // this.quad0 = null;
    // this.quad1 = null;
    // this.quad2 = null;
    // this.quad3 = null;
    let quads: string[] = [];
    for (let i = 0; i < quadCount; ++i) {
      quads.push(`${indent}quad${i} = null;`);
    }
    return quads.join('\n');
  }
}

function getInsertStackCode() {
  return `
/**
 * Our implementation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressure: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}
`;
}


//////////////////////////////////////////////////
//// generateVariableName.js
//////////////////////////////////////////////////

function getVariableName(index: number) {
  if (index === 0) return 'x';
  if (index === 1) return 'y';
  if (index === 2) return 'z';
  return 'c' + (index + 1);
};