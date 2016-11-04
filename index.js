'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend-shallow');
var parse = require('./lib/parse');

function load(graph, options) {
  if (typeof graph !== 'object') {
    throw new TypeError('expected the first argument to be an object');
  }

  var opts = extend({
    cwd: '.',
    labels: 'labels.json',
    meta: 'meta.json',
    links: 'links.bin'
  }, options);

  var meta = readJSON(toPath(opts.cwd, opts.meta));
  if (!meta) {
    throw new Error(`Unable to read metadata from ${toPath(opts.cwd, opts.meta)}`);
  }

  // date: +new Date(),
  // nodeCount: graph.getNodesCount(),
  // linkCount: graph.getLinksCount(),
  // nodeFile: options.labels,
  // linkFile: options.links,
  // version: require(path.join(__dirname, 'package.json')).version

  var nodesFp = meta.nodeFile ? path.resolve(process.cwd(), meta.nodeFile) : toPath(opts.cwd, opts.labels);
  var linksFp = meta.linkFile ? path.resolve(process.cwd(), meta.linkFile) : toPath(opts.cwd, opts.links);

  var labels = readJSON(nodesFp);
  if (!labels) {
    throw new Error(`Unable to read labels from ${nodesFp}`);
  }

  var links = readBuffer(linksFp);
  if (!links) {
    throw new Error(`Unable to read links from ${linksFp}`);
  }

  return parse(graph, labels, links);
};

function toPath(cwd, filename) {
  return path.join(cwd, filename);
}

function readJSON(fp) {
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch (err) {}
}

function readBuffer(fp) {
  try {
    return fs.readFileSync(fp);
  } catch (err) {}
}

module.exports = load;
