import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
  method: 'POST',
  params: '/:id',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params, body } = req
    const { id } = params
    try {
      await $model.findOneAndUpdate({ _id: id, ...query }, { $push: { [prop]: body } }, { runValidators: true })
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
