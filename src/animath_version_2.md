In animath, we have a 1d, 2d and 3d verlet system.

We are also planning to include layout managers to organise
points or a subset of points according to various
algorithms.
1. Dagre (for verlet systems that are DAGS)
/Users/jack/evryzin/animath/ripped-dagre
2. Force Directed Graph Layout (already supported by verlet
simulation)
3. Sugiyama /Users/jack/evryzin/animath/layouts/layouts/Sug
iyamaLayouter.ts - is this already covered by ripped dagre


We are also looking into supporting external graphs, verlet systems. This depends on the performance cost involved for the physics simulations (verlet simulation).

Suggested interface for external graphs.


```typescript
interface IGraphReader {
  getAllNodes?() : Iterable<any>
  getAllEdges?() : Iterable<any>

  getEdges( node: any, outgoing?: boolean, incoming?:boolean ) : Iterable<any>
  getEdgesOfNodeKey?( nodeKey:  string | number, outgoing?: boolean, incoming?:boolean ) : Iterable<any>

  getFromNode( edge: any ) : any
  getFromNodeOfEdgeKey?( edgeKey: string | number ) : any

  getToNode( edge:any ) : any
  getToNodeOfEdgeKey?( edgeKey:string | number ) : any

  getNodeKey?( node:any ) : string | number | undefined
  getEdgeKey?( edge:any ) : string | number | undefined

  getPosition?( node ) : vecx
  getPositionOfNodeKey?( nodeKey: string | number  ) : vecx

  .... other optional edge and node data needed for verlet system

  getNodeCargo?( node ) : any
  getCargoOfNodeKey?( nodeKey : string | number) : any

  getEdgeCargo?( edge ) : any
  getCargoOfEdgeKey?( edgeKey: string | number ) : any

  getDirectioned?( edge ) : boolean
  getDirectionedOfEdgeKey?( edgeKey : string|number ) : boolean



}


```