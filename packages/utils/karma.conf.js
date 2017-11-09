const baseConf = require('../../karma.conf')

module.exports = baseConf({
  files: [
    { pattern: 'node_modules/@ractivejs/utils-samples/src/*.ractive.html', watched: false, included: false },
    { pattern: 'node_modules/@ractivejs/utils-samples/src/*.json', watched: false, included: false },
    'node_modules/@ractivejs/core/dist/lib.umd.js',
    'dist/lib.umd.js',
    'tmp/test.umd.js'
  ],
  proxies: {
    '/samples/': '/base/node_modules/@ractivejs/utils-samples/src/'
  }
})
