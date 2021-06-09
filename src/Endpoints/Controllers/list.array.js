import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
  method: 'GET',
  params: '/:id',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, fields, paginate, sort } = req
    const { id } = params
    try {
      const data = await $model.find(query, { fields, paginate, sort, array: { prop, document: id } })
      return { status: 200, message: 'Ok', data }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
