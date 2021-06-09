import { Types } from 'mongoose'
import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'
  
export default ({ middlewares, isPublic }) => register({
  method: 'GET',
  params: '/:id',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, fields, params } = req
    const { id } = params
    try {
      const data = await $model.findOne({ _id: Types.ObjectId(id), ...query }, { fields })
      return { status: 200, message: 'Ok', data }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
