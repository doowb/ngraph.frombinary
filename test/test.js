'use strict';

require('mocha');
var path = require('path');
var assert = require('assert');
var Graph = require('ngraph.graph');
var load = require('../');

describe('ngraph.frombinary', function() {
  it('should export a function', function() {
    assert.equal(typeof load, 'function');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      load();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected the first argument to be an object');
      cb();
    }
  });

  it('should load a graph from a given metadata file', function() {
    var graph = new Graph({uniqueLinkIds: false});
    graph = load(graph, {cwd: path.join(__dirname, 'fixtures')});
    assert.equal(graph.getNodesCount(), 4);
    assert.equal(graph.getLinksCount(), 3);

    var i = 0;
    var labels = ['a', 'b', 'c', 'd'];
    graph.forEachNode(function(node) {
      assert.equal(node.id, labels[i++]);
    });
  });
});
