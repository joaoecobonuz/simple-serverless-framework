import { Types } from 'mongoose'
import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
  method: 'GET',
  params: '/:id/:document',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params } = req
    const { id, document } = params
    try {
      const data = await $model.findOne({ _id: Types.ObjectId(id), ...query }, { fields, array: { prop, query: { _id: Types.ObjectId(document), ...query } } })
      return { status: 200, message: 'Ok', data }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
