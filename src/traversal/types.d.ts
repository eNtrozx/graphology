import {NeighborEntry, Attributes} from 'graphology-types';

export type TraversalCallback<NodeAttributes extends Attributes = Attributes> =
  (key: string, attributes: NodeAttributes, depth: number) => boolean | void;
export type TraversalOrderCallback<NodeAttributes extends Attributes = Attributes> =
  (key: string, attributes: NodeAttributes, neighbors: IterableIterator<NeighborEntry<NodeAttributes>>) => 
  IterableIterator<NeighborEntry<NodeAttributes>>

export type TraversalMode =
  | 'in'
  | 'out'
  | 'directed'
  | 'undirected'
  | 'inbound'
  | 'outbound';

export type TraversalOptions<N> = {
  mode?: TraversalMode;
  traversalOrder?: TraversalOrderCallback<N>;
};
