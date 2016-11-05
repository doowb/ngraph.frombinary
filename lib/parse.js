'use strict';
var isBuffer = require('is-buffer');

/**
 * Parse function that can be used directly to parse a `links` buffer and populate
 * a [ngraph.graph][] graph with nodes and links. This is useful when the labels (node names) array
 * and the links buffer have already been loaded into memory.
 *
 * ```js
 * var labels = ['a', 'b', 'c', 'd'];
 * var links = fs.readFileSync('links.bin');
 * // links contains a binary buffer that looks like: `-1 2 3 -4 2`
 * var graph = load.parse(new Graph({uniqueLinkIds: false}), labels, links);
 * console.log(graph.getNodesCount());
 * //=> 4
 * console.log(graph.getLinksCount());
 * //=> 3
 * ```
 * @param  {Object} `graph` [ngraph.graph][] instance to load nodes and links onto.
 * @param  {Array} `labels` Array of labels used to lookup node names for the graph.
 * @param  {Buffer} `links` Binary buffer represented links to deserialize onto the graph.
 * @return {Object} graph instance populated with nodes and links.
 * @api public
 */

module.exports = function parse(graph, labels, links) {
  if (typeof graph !== 'object') {
    throw new TypeError('expected the first argument to be an object');
  }

  if (!Array.isArray(labels)) {
    throw new TypeError('expected the second argument to be an array');
  }

  if (!isBuffer(links)) {
    throw new TypeError('expected the third argument to be a Buffer');
  }

  var current;
  var len = links.length;
  for (var i = 0; i < len; i += 4) {
    var val = links.readInt32LE(i);
    if (!current && val >= 0) {
      throw new Error('expected initial value in links to be a negative number');
    }

    if (val < 0) {
      current = val;
      graph.addNode(labels[-current - 1]);
    } else {
      graph.addLink(labels[-current - 1], labels[val - 1]);
    }
  }

  return graph;
};
