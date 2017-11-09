const pkg = require('../package.json')
const buble = require('rollup-plugin-buble')

export default {
  sourcemap: true,
  plugins: [
    buble({transforms: { modules: false }})
  ],
  input: 'test/index.js',
  output: { file: 'tmp/test.umd.js', format: 'umd', name: pkg.name },
  globals: {
    qunit: 'QUnit',
    '@ractivejs/core': 'Ractive',
    [pkg.name]: pkg.name
  },
  external: [
    'qunit',
    '@ractivejs/core',
    pkg.name
  ]
}
