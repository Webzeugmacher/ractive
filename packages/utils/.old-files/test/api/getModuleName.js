import { module, test } from 'qunit'
import Utils from '@ractivejs/utils'

module('getModuleName')

const specs = [
  {
    input: 'foo',
    expected: 'foo'
  },
  {
    input: 'foo.js',
    expected: 'foo'
  },
  {
    input: './foo',
    expected: 'foo'
  },
  {
    input: './foo.js',
    expected: 'foo'
  },
  {
    input: './path/to/foo',
    expected: 'foo'
  },
  {
    input: './path/to/foo.js',
    expected: 'foo'
  },
  {
    input: '/path/to/foo',
    expected: 'foo'
  },
  {
    input: '/path/to/foo.js',
    expected: 'foo'
  }
]

specs.forEach((spec, index) => {
  test(`getModuleName spec #${index}`, assert => {
    assert.strictEqual(Utils.getModuleName(spec.input), spec.expected)
  })
})
