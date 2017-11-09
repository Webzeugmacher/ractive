import getParts from './getParts'
import getCompiled from './getCompiled'
import getModule from './getModule'

export default function compile (source, compileOptions) {
  const { code, map } = getModule(getCompiled(getParts(source), compileOptions))
  return { code, map }
}
