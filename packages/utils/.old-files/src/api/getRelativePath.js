export default function getRelativePath (base, path) {
  // If we've got an absolute path, or base is '', return
  // relativePath
  if (!base || path.charAt(0) === '/') return path

  // 'foo/bar/baz.html' -> ['foo', 'bar', 'baz.html']
  let baseParts = (base || '').split('/')
  let pathParts = path.split('/')

  // ['foo', 'bar', 'baz.html'] -> ['foo', 'bar']
  baseParts.pop()

  let part

  while (part = pathParts.shift()) {
    if (part === '..') {
      baseParts.pop()
    } else if (part !== '.') {
      baseParts.push(part)
    }
  }

  return baseParts.join('/')
}
