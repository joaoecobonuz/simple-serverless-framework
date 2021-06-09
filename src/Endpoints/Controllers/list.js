import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ middlewares, isPublic }) => register({
  method: 'GET',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, fields, paginate, sort } = req
    try {
      const data = await $model.find(query, { fields, paginate, sort })
      return { status: 200, message: 'Ok', data }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
