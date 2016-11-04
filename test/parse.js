'use strict';

require('mocha');
var assert = require('assert');
var Graph = require('ngraph.graph');

var parse = require('../lib/parse');

describe('parse', function() {
  it('should export a function', function() {
    assert.equal(typeof parse, 'function');
  });

  it('should throw an error when the first argument is invalid', function(cb) {
    try {
      parse();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected the first argument to be an object');
      cb();
    }
  });

  it('should throw an error when the second argument is invalid', function(cb) {
    try {
      parse(new Graph({uniqueLinkIds: false}));
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected the second argument to be an array');
      cb();
    }
  });

  it('should throw an error when the third argument is invalid', function(cb) {
    try {
      parse(new Graph({uniqueLinkIds: false}), []);
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected the third argument to be a Buffer');
      cb();
    }
  });

  it('should parse a buffer of links into a graph', function() {
    var labels = ['a', 'b', 'c', 'd'];
    var links = new Buffer(20);

    [-1, 2, 3, -4, 2].forEach(function(val, i) {
      links.writeInt32LE(val, i*4);
    });

    var graph = new Graph({uniqueLinkIds: false});

    graph = parse(graph, labels, links);
    assert.equal(graph.getNodesCount(), 4);
    assert.equal(graph.getLinksCount(), 3);

    var i = 0;
    graph.forEachNode(function(node) {
      assert.equal(node.id, labels[i++]);
    });
  });
});
