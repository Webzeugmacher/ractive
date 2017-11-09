import { module, test } from 'qunit'
import Utils from '@ractivejs/utils'

module('getRelativePath')

const specs = [
  // No base
  {
    base: '',
    path: 'foo.html',
    expected: 'foo.html'
  },
  {
    base: '',
    path: './foo.html',
    expected: './foo.html'
  },
  {
    base: '',
    path: './path/to/foo.html',
    expected: './path/to/foo.html'
  },
  {
    base: '',
    path: '/foo.html',
    expected: '/foo.html'
  },
  {
    base: '',
    path: '/path/to/foo.html',
    expected: '/path/to/foo.html'
  },
  // With base
  {
    base: 'components/',
    path: 'foo.html',
    expected: 'components/foo.html'
  },
  {
    base: 'components/',
    path: './foo.html',
    expected: 'components/foo.html'
  },
  {
    base: 'components/',
    path: './path/to/foo.html',
    expected: 'components/path/to/foo.html'
  },
  {
    base: 'components/',
    path: '../path/to/foo.html',
    expected: 'path/to/foo.html'
  },
  {
    base: 'components/',
    path: '/foo.html',
    expected: '/foo.html'
  },
  {
    base: 'components/',
    path: '/path/to/foo.html',
    expected: '/path/to/foo.html'
  },
  // File as base
  {
    base: 'bar.html',
    path: 'foo.html',
    expected: 'foo.html'
  },
  {
    base: 'bar.html',
    path: './foo.html',
    expected: 'foo.html'
  },
  {
    base: 'bar.html',
    path: './path/to/foo.html',
    expected: 'path/to/foo.html'
  },
  {
    base: 'bar.html',
    path: '/foo.html',
    expected: '/foo.html'
  },
  {
    base: 'bar.html',
    path: '/path/to/foo.html',
    expected: '/path/to/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: 'foo.html',
    expected: 'path/to/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: './foo.html',
    expected: 'path/to/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: './path/to/foo.html',
    expected: 'path/to/path/to/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: '/foo.html',
    expected: '/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: '/path/to/foo.html',
    expected: '/path/to/foo.html'
  },
  {
    base: 'path/to/bar.html',
    path: '../foo.html',
    expected: 'path/foo.html'
  }
]

specs.forEach((spec, index) => {
  test(`getRelativePath spec #${index}`, assert => {
    assert.strictEqual(Utils.getRelativePath(spec.base, spec.path), spec.expected)
  })
})
