import { model, Schema, Types } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import MongoQL from './MongoQL'
import { getContext, getDatabaseSchema, getDatabaseRelationships } from '../utils'

export default ({ indexes = [] }) => {
  const { module } = getContext()
  const schema = getDatabaseSchema({ module })
  const relationships = getDatabaseRelationships({ module })

  const moduleSchema = new Schema(schema, { timestamps: true })

  moduleSchema.statics.find = async function (query, options = {}) {
    const $model = this.model(module)
    const $pipelines = MongoQL.pipelines(relationships, { query: { ...query, fields: options?.fields } })

    const $arrayPipelines = options?.array?.prop && options?.array?.document
      ? [
          { $match: { _id: Types.ObjectId(options?.array?.document) } },
          { $unwind: `$${options?.array?.prop}` },
          { $replaceRoot: { newRoot: `$${options?.array?.prop}` } }
        ]
      : []

    const aggregate = $model.aggregate([...$arrayPipelines, ...$pipelines])
    const data = await $model.aggregatePaginate(aggregate, { ...options.paginate, sort: options.sort })
    return data
  }

  moduleSchema.statics.findById = async function (id, options = {}) {
    const $model = this.model(module)
    const $pipelines = MongoQL.pipelines(relationships, { query: { fields: options?.fields } })

    const $arrayPipelines = options?.array?.prop && options?.array?.document
      ? [
          { $match: { _id: Types.ObjectId(id) } },
          { $unwind: `$${options?.array?.prop}` },
          { $replaceRoot: { newRoot: `$${options?.array?.prop}` } },
          { $match: { _id: Types.ObjectId(options?.array?.document) } },
        ]
      : []

    const [data] = await $model.aggregate([...$arrayPipelines, ...$pipelines])
    return data
  }

  moduleSchema.statics.findOne = async function (query, options = {}) {
    const $model = this.model(module)
    const $pipelines = MongoQL.pipelines(relationships, { query: { ...options?.array?.query, fields: options?.fields } })

    const $arrayPipelines = options?.array?.prop && options?.array?.query
      ? [
          { $match: query },
          { $unwind: `$${options?.array?.prop}` },
          { $replaceRoot: { newRoot: `$${options?.array?.prop}` } },
          { $match: options?.array?.query },
        ]
      : []

    const [data] = await $model.aggregate([...$arrayPipelines, ...$pipelines])
    return data
  }

  moduleSchema.plugin(aggregatePaginate)

  indexes.forEach(({ index, options }) => moduleSchema.index(index, options))

  const Model = model(module, moduleSchema, module)

  return Model
}
