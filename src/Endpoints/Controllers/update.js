import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ middlewares, isPublic }) => register({
  method: 'PATCH',
  params: '/:id',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params, body } = req
    const { id } = params
    try {
      await $model.findOneAndUpdate({ _id: id, ...query }, { $set: body }, { runValidators: true })
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
