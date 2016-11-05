'use strict';

require('mocha');
var path = require('path');
var del = require('delete');
var mkdirp = require('mkdirp');
var assert = require('assert');
var save = require('ngraph.tobinary');
var Graph = require('ngraph.graph');
var load = require('../');

describe('ngraph.frombinary', function() {
  beforeEach(function() {
    mkdirp.sync(path.join(__dirname, 'actual'));
  });

  afterEach(function() {
    del.sync(path.join(__dirname, 'actual'));
  });

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

  it('should load a graph from a saved graph', function() {
    var graph = new Graph({uniqueLinkIds: false});
    graph.addLink('foo', 'bar');
    graph.addLink('bar', 'baz');
    graph.addLink('baz', 'bang');
    graph.addLink('baz', 'foo');

    save(graph, {outDir: path.join(__dirname, 'actual')});
    var actual = new Graph({uniqueLinkIds: false});
    actual = load(actual, {cwd: path.join(__dirname, 'actual')});

    assert.equal(actual.getNodesCount(), graph.getNodesCount());
    assert.equal(actual.getLinksCount(), graph.getLinksCount());

    graph.forEachNode(function(node) {
      var actualNode = actual.getNode(node.id);
      assert(actualNode);
      assert.deepEqual(actualNode, node);

      var expectedLinks = graph.getLinks(node.id);
      var actualLinks = actual.getLinks(actualNode.id);
      assert.deepEqual(actualLinks, expectedLinks);
    });
  });
});
