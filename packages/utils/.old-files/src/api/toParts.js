import Ractive from '@ractivejs/core'
import getAttribute from '../utils/getAttribute.js'

const element = 7

const parseDefaults = {
  interpolate: { script: false, style: false },
  includeLinePositions: true
}

const isElement = i => i && i.t === element
const isLink = i => isElement(i) && i.e === 'link'
const isTemplate = i => isElement(i) && i.e === 'template'
const isStyle = i => isElement(i) && i.e === 'style'
const isScript = i => isElement(i) && i.e === 'script'
const isWhitespace = i => i === ' '
const trimEnd = s => s.replace(/[\s\uFEFF\xA0]+$/, '')
const getLineInfo = x => x.split('\n').reduce((s, l, i) => ({ line: i + 1, column: l.length, offset: x.length }), null)
const getStartLineInfo = (content, addition) => getLineInfo(`${content}${addition}`)
const getEndLineInfo = (content, subtraction) => getLineInfo(content.slice(0, -subtraction.length))

export default function toParts (content, parseOptions = {}) {
  const parsed = Ractive.parse(content, Object.assign({}, parseDefaults, parseOptions))
  const items = parsed.t

  const components = {}
  let template = null
  let script = null
  let style = null

  let remainingContent = trimEnd(content)
  let itemIndex = items.length

  while (itemIndex--) {
    const item = items[itemIndex]

    if (isLink(item)) {
      const name = getAttribute('name', item)
      if (!name) throw new Error('Link-imported components must have a name attribute.')
      if (components.hasOwnProperty(name)) throw new Error(`Link-imported component names must only be used once.`)

      const module = getAttribute('href', item)
      if (!module) throw new Error('Link-imported components must have an href attribute.')

      const async = getAttribute('async', item) !== undefined

      components[name] = { module, async }
      remainingContent = remainingContent.slice(0, item.p[2])
    } else if (isTemplate(item)) {
      if (template) throw new Error('There can only be one top-level <template>')

      const itemOffset = item.p[2]
      const contentWithoutItem = remainingContent.slice(0, itemOffset)
      const itemParts = remainingContent.slice(itemOffset).match(/(<template[\s\S]*?>)([\s\S]*?)(<\/template>)/i)
      const start = getStartLineInfo(contentWithoutItem, itemParts[1])
      const source = itemParts[2]
      const end = getEndLineInfo(remainingContent, itemParts[3])
      const lang = getAttribute('lang', item) || 'html'

      template = source ? { source, start, end, props: { lang } } : null
      remainingContent = contentWithoutItem
    } else if (isStyle(item)) {
      if (style) throw new Error('There can only be one top-level <style>')

      const itemOffset = item.p[2]
      const contentWithoutItem = remainingContent.slice(0, itemOffset)
      const itemParts = remainingContent.slice(itemOffset).match(/(<style[\s\S]*?>)([\s\S]*?)(<\/style>)/i)
      const start = getStartLineInfo(contentWithoutItem, itemParts[1])
      const source = itemParts[2]
      const end = getEndLineInfo(remainingContent, itemParts[3])
      const lang = getAttribute('lang', item) || 'css'
      const scoped = getAttribute('lang', item) !== 'false'

      style = source ? { source, start, end, props: { lang, scoped } } : null
      remainingContent = contentWithoutItem
    } else if (isScript(item)) {
      if (script) throw new Error('There can only be one top-level <script>')

      const itemOffset = item.p[2]
      const contentWithoutItem = remainingContent.slice(0, itemOffset)
      const itemParts = remainingContent.slice(itemOffset).match(/(<script[\s\S]*?>)([\s\S]*?)(<\/script>)/i)
      const start = getStartLineInfo(contentWithoutItem, itemParts[1])
      const source = itemParts[2]
      const end = getEndLineInfo(remainingContent, itemParts[3])
      const lang = getAttribute('lang', item) || 'js'

      script = source ? { source, start, end, props: { lang } } : null
      remainingContent = contentWithoutItem
    } else if (isWhitespace(item)) {
      remainingContent = trimEnd(remainingContent)
    } else {
      throw new Error(`Unexpected top-level element ${item}`)
    }
  }

  return { components, template, style, script }
}
