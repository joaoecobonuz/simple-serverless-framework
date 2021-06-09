import fs from 'fs'
import normalizePath from 'normalize-path'

const safeTryCatch = (callback) => {
  try {
    return callback()
  } catch (err) {
    return undefined
  }
}

const readModules = () => safeTryCatch(() => fs.readdirSync('src/modules'))
const readModuleServices = ({ module }) => safeTryCatch(() => fs.readFileSync(`src/modules/${module}/services`))
const getDatabaseSchema = ({ module }) => safeTryCatch(() => require(`${process.cwd()}/src/modules/${module}/database/schema`).default)
const getDatabaseModel = ({ module }) => safeTryCatch(() => require(`${process.cwd()}/src/modules/${module}/database/model`).default)
const getDatabaseRelationships = ({ module }) => safeTryCatch(() => require(`${process.cwd()}/src/modules/${module}/relationships/schema`).default)
const getModuleService = ({ module, service }) => safeTryCatch(() => require(`${process.cwd()}/src/modules/${module}/services/${service}`).default)

const makeHookService = ({ $model, $services }) => (id, options) => {
  const filterWithState = (value) => ([_, { withState = false }]) => withState === value
  const mapHandler = ($state) => ([key, { handler }]) => ([key, handler($state)])

  const isStateless = filterWithState(false)
  const isStatefull = filterWithState(true)

  const hook = (value, condition, { $state }) => Object.fromEntries(
    Object
      .entries(value)
      .filter(condition)
      .map(mapHandler($state))
  )

  const stateless = ({ $services }) => hook($services, isStateless, { $state: undefined })
  const statefull = async (id, options, { $model, $services }) => {
    const $state = await $model.findById(id, options)
    return hook($services, isStatefull, { $state })
  }

  return id
    ? statefull(id, options, { $model, $services })
    : stateless({ $services })
}

const getService = ({ module }) => {
  const $model = getDatabaseModel({ module })

  const $serviceName = (value) => first(value.split('.'))

  const $services = readModuleServices({ module }).reduce((state, service) => ({
    ...state,
    [$serviceName]: getModuleService({ module, service })
  }), {})

  return makeHookService({ $model, $services })
}

const getServices = () => {
  const $serviceName = (value) => `$${value}Services`

  const $services = readModules().reduce((state, module) => ({
    ...state,
    [$serviceName(module)]: getService({ module })
  }), {})

  return $services
}

const getContext = () => {
  const trace = normalizePath(Error().stack.split('Object.<anonymous>')[1].split('.js')[0]).split('modules')[1].split('/').filter(st => st)
  const [module, service, a, b] = trace

  const [file] = service === 'endpoints'
    ? b.split('.js')
    : a.split('.js')
  const version = service === 'endpoints'
    ? a
    : undefined
  const path = service === 'endpoints'
    ? `src/modules/${module}/${service}/${version}/${file}`
    : `src/modules/${module}/${service}/${file}`

  return {
    module,
    version,
    service,
    file,
    path
  }
}

const kebabize = (value) => value.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())

export {
  readModules,
  getDatabaseSchema,
  getDatabaseModel,
  getDatabaseRelationships,
  getService,
  getServices,
  getContext,
  kebabize
}
