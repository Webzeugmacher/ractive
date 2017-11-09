export default function getAttribute (name, node) {
  if (node.a && node.a[name]) return node.a[name]
  else if (node.m) {
    let i = node.m.length
    while (i--) {
      const a = node.m[i]
      // plain attribute
      if (a.t === 13) {
        if (a.n === name) return a.f
      }
    }
  }
}
