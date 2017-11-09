const baseConf = require('../../karma.conf')

module.exports = baseConf({
  files: [
    { pattern: 'samples/*.ractive.html', watched: false, included: false, nocache: true },
    { pattern: 'samples/*.json', watched: false, included: false, nocache: true },
    'node_modules/@ractivejs/core/dist/lib.umd.js',
    'dist/lib.umd.js',
    'tmp/test.umd.js'
  ]
})
