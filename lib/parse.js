'use strict';
var isBuffer = require('is-buffer');

module.exports = function(graph, labels, links) {
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
