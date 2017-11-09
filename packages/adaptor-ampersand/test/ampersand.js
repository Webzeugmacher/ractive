// Rollup has trouble bundling CJS modules, even when the necessary plugins are
// in place (node-resolve, json, commonjs, node-globals, node-builtins).
//
// So we fall back to using Browserify which Ampersand denies that it requires,
// but the flawless bundling doesn't lie.
// https://ampersandjs.com/learn/npm-browserify-and-modules/
exports.Model = require('ampersand-model')
exports.Collection = require('ampersand-collection')
