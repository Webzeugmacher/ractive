import Ractive from '@ractivejs/core'

const element = 7

const parserOptions = {
  interpolate: { script: false, style: false },
  includeLinePositions: true
}

const contentPatterns = {
  template: /(<template[\s\S]*?>)([\s\S]*?)(<\/template>)/i,
  style: /(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/i,
  script: /(<script[\s\S]*?>)([\s\S]*?)(<\/script>)/i
}

const containerElements = [ 'template', 'style', 'script' ]

const trimEnd = s => s.replace(/[\s\uFEFF\xA0]+$/, '')

const isImport = i => i && i.t === element && i.e === 'link'
const isContainerElement = i => i && i.t === element && containerElements.indexOf(i.e) > -1
const isWhitespace = i => i === ' '

const getLineInfo = x => x.split('\n').reduce((s, l, i) => ({ line: i + 1, column: l.length, offset: x.length }), null)
const getStartLineInfo = (content, addition) => getLineInfo(`${content}${addition}`)
const getEndLineInfo = (content, subtraction) => getLineInfo(content.slice(0, -subtraction.length))
const getAttribute = (name, node) => {
  return node.a && node.a[name] ? node.a[name]
    : node.m ? (node.m.find(a => a.t === 13 && a.n === name) || {}).f
    : undefined
}

export default function toParts (content) {
  const parsed = Ractive.parse(content, parserOptions)
  const items = parsed.t

  const parts = {
    components: null,
    template: null,
    script: null,
    style: null
  }

  let remainingContent = trimEnd(content)
  let itemIndex = items.length

  while (itemIndex--) {
    const item = items[itemIndex]

    if (isImport(item)) {
      const module = getAttribute('href', item)
      if (!module) throw new Error('Linked components must have the href attribute.')

      const name = getAttribute('name', item)
      if (!name) throw new Error('Linked components must have the name attribute.')
      if (parts.components.hasOwnProperty(name)) throw new Error(`Linked component name ${name} is already taken by ${parts.components[name].module}.`)

      const async = getAttribute('async', item) !== undefined

      parts.components[name] = { module, async }
      remainingContent = remainingContent.slice(0, item.p[2])
    } else if (isContainerElement(item)) {
      const elementName = item.e

      if (parts[elementName] !== null) throw new Error(`There can only be one top-level <${elementName}>.`)

      const itemOffset = item.p[2]
      const contentWithoutItem = remainingContent.slice(0, itemOffset)
      const itemParts = remainingContent.slice(itemOffset).match(contentPatterns[elementName])
      const start = getStartLineInfo(contentWithoutItem, itemParts[1])
      const code = itemParts[2]
      const end = getEndLineInfo(remainingContent, itemParts[3])
      const map = ''
      const lang = getAttribute('lang', item) || 'html'

      parts[elementName] = code ? { code, map, start, end, props: { lang } } : null
      remainingContent = contentWithoutItem
    } else if (isWhitespace(item)) {
      remainingContent = trimEnd(remainingContent)
    } else {
      throw new Error(`Unexpected top-level element ${item}.`)
    }
  }

  return parts
}
