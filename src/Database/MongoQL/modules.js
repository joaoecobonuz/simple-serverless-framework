import { head, last } from 'lodash'

const pickModules = (relationships) => Object
  .entries(relationships)
  .reduce((modules, relationship) => ([
    ...modules,
    ...last(relationship).map(head)
  ]), [])

const requiredModules = (modules, keys) => modules.filter(module => keys.some(key => key.startsWith(module) && key !== module))

const orderModules = (modules) => [...modules].sort((a, b) => b.length - a.length)

export { pickModules, requiredModules, orderModules }
