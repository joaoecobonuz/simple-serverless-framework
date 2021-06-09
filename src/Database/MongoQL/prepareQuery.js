import { head, uniq } from 'lodash'

const prepareQuery = (value = {}) => {
  const { fields = '_id', ...query } = value

  const match = Object.entries(query)
  const project = fields.split(',')

  const keys = uniq([
    ...match.map(head),
    ...project
  ])

  return {
    match,
    project,
    keys
  }
}

export default prepareQuery
