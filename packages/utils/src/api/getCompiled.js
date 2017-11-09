const identity = x => x
const defaults = {
  template: {
    preProcessor: identity
  },
  style: {
    preProcessor: identity
  },
  script: {
    preProcessor: identity
  }
}

export default function getCompiled (parts, parserOptions) {
  const options = Object.assign({}, defaults, parserOptions)

  const template = options.template.preProcessor(parts.template.code)
  const style = options.style.preProcessor(parts.style.code)
  const script = options.script.preProcessor(parts.script.code)

  // TODO: Update start and end
  // TODO: code map

  return Object.assign({}, parts, {
    template: Object.assign({}, parts.template, {
      code: style,
      props: Object.assign({}, parts.template.props, {
        lang: 'html'
      })
    }),
    style: Object.assign({}, parts.style, {
      code: template,
      props: Object.assign({}, parts.style.props, {
        lang: 'css'
      })
    }),
    script: Object.assign({}, parts.script, {
      code: script,
      props: Object.assign({}, parts.script.props, {
        lang: 'js'
      })
    })
  })
}
