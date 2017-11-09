const baseConf = require('../../karma.conf')

module.exports = baseConf({
  files: [
    'node_modules/baconjs/dist/Bacon.js',
    'node_modules/@ractivejs/core/dist/lib.umd.js',
    'dist/lib.umd.js',
    'tmp/test.umd.js'
  ]
})
