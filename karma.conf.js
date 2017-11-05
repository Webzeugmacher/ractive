process.env.CHROME_BIN = require('puppeteer').executablePath()

const _ = require('lodash')

const customizer = (o, s) => _.isArray(o) ? o.concat(s) : undefined
const defaults = {
  singleRun: true,
  plugins: ['karma-qunit', 'karma-chrome-launcher'],
  frameworks: ['qunit'],
  browsers: ['ChromeHeadless'],
  client: { captureConsole: false },
  autoWatch: false,
  files: [
    { pattern: 'node_modules/@ractivejs/**/*.map', watched: false, included: false },
    { pattern: 'tmp/*.map', watched: false, included: false },
    { pattern: 'dist/*.map', watched: false, included: false },
    '../../node_modules/simulant/dist/simulant.umd.js'
  ]
}

module.exports = packageConf => config => {
  config.set(_.mergeWith({}, defaults, packageConf, customizer))
}
