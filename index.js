'use strict';

var fs = require('fs');
var path = require('path');
var extend = require('extend-shallow');
var parse = require('./lib/parse');

/**
 * Load a ngraph.graph that was previously saved using [ngraph.tobinary][].
 * This expects that the `meta.json` file created with [ngraph.tobinary][] is in the folder.
 * See the [parse](#parse) method below when labels and links are already in memory.
 *
 * ```js
 * var graph = load(new Graph({uniqueLinkIds: false}), {cwd: '.'});
 * console.log(graph.getNodesCount());
 * //=> 4
 * console.log(graph.getLinksCount());
 * //=> 3
 * ```
 * @param  {Object} `graph` [ngraph.graph][] instance to load the binary files into.
 * @param  {Object} `options` Options to determine where the graph is loaded from.
 * @param  {String} `options.cwd` Directory where the files are located. Defaults to `.`.
 * @param  {String} `options.labels` Name of the labels file. Defaults to `labels.json`.
 * @param  {String} `options.links` Name of the links file. Defaults to `meta.json`.
 * @param  {String} `options.meta` Name of the meta file. Defaults to `links.bin`.
 * @return {Object} graph instance that was passed in after loading the binary files.
 * @api public
 */

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

/**
 * Expose `load` function
 */

module.exports = load;

/**
 * Expose `parse` function
 */

module.exports.parse = parse;
