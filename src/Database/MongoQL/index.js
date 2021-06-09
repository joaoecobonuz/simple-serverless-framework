import prepareQuery from './prepareQuery'
import { pickModules, requiredModules, orderModules } from './modules'
import buildMatch from './buildMatch'
import buildProject from './buildProject'
import buildPipelines from './buildPipelines'
import hasOne from './hasOne'
import hasMany from './hasMany'

const pipelines = (relationships, { query }) => {
  const { match, project, keys } = prepareQuery(query)

  const modules = pickModules(relationships)
  const requiredableModules = requiredModules(modules, keys)
  const orderedModules = orderModules(modules)

  const { root: $match, ...$relationshipsMatch } = buildMatch(orderedModules, match)
  const { root: $project, ...$relationshipsProject } = buildProject(orderedModules, project)
  const $pipelines = buildPipelines(relationships, {
    modules: requiredableModules,
    $relationshipsMatch,
    $relationshipsProject
  })

  return [
    { $match },
    ...$pipelines,
    { $project }
  ]
}

export default {
  pipelines,
  hasOne,
  hasMany
}
