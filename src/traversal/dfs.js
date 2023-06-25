/**
 * Graphology Traversal DFS
 * =========================
 *
 * Depth-First Search traversal function.
 */
var isGraph = require('graphology-utils/is-graph');
var DFSStack = require('graphology-indices/dfs-stack');
var utils = require('./utils');

var TraversalRecord = utils.TraversalRecord;
var capitalize = utils.capitalize;

/**
 * DFS traversal in the given graph using a callback function
 *
 * @param {Graph}    graph        - Target graph.
 * @param {string}   startingNode - Optional Starting node.
 * @param {function} callback     - Iteration callback.
 * @param {object}   options      - Options:
 * @param {string}     mode         - Traversal mode.
 */
function abstractDfs(graph, startingNode, callback, options) {
  options = options || {};

  if (!isGraph(graph))
    throw new Error(
      'graphology-traversal/dfs: expecting a graphology instance.'
    );

  if (typeof callback !== 'function')
    throw new Error(
      'graphology-traversal/dfs: given callback is not a function.'
    );

  // Early termination
  if (graph.order === 0) return;

  var stack = new DFSStack(graph);

  var neighborEnteries =
    graph[(options.mode || 'outbound') + 'NeighborEntries'].bind(
      graph
    );

  var forEachNode;

  if (startingNode === null) {
    forEachNode = stack.forEachNodeYetUnseen.bind(stack);
  } else {
    forEachNode = function (fn) {
      startingNode = '' + startingNode;
      fn(startingNode, graph.getNodeAttributes(startingNode));
    };
  }

  var record, stop;

  function visit(neighbor, attr) {
    stack.pushWith(
      neighbor,
      new TraversalRecord(neighbor, attr, record.depth + 1)
    );
  }

  forEachNode(function (node, attr) {
    stack.pushWith(node, new TraversalRecord(node, attr, 0));

    while (stack.size !== 0) {
      record = stack.pop();
      if (stack.has(record.node)) continue

      stop = callback(record.node, record.attributes, record.depth);

      if (stop === true) continue;

      var neighbors = neighborEnteries(record.node)
      if (options.traversalOrder) {
        neighbors = options.traversalOrder(record.node, record.attributes, neighbors)
      } 
      
      for (var neighbor of neighbors) {
        visit(...Object.values(neighbor))
      }
    }
  });
}

exports.dfs = function (graph, callback, options) {
  return abstractDfs(graph, null, callback, options);
};
exports.dfsFromNode = abstractDfs;
