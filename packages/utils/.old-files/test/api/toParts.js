/* eslint-env browser */
import { module, test } from 'qunit'
import Utils from '@ractivejs/utils'

module('utils toParts')

const specs = [
  'Full',
  'Simple',
  'EmptyTopLevels',
  'Languages'
]

specs.forEach((spec, index) => {
  test(`${spec}`, assert => {
    const done = assert.async()
    const source = fetch(`/base/samples/${spec}.ractive.html`).then(r => r.text())
    const output = fetch(`/base/samples/${spec}.json`).then(r => r.json())

    Promise.all([source, output]).then(([source, output]) => {
      assert.deepEqual(Utils.toParts(source), output)
      done()
    })
  })
})
