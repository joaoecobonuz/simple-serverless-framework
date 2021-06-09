import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
  method: 'POST',
  params: '/:id/:document',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params } = req
    const { id, document } = params
    try {
      await $model.findOneAndUpdate({ _id: id, [`${prop}._id`]: document, ...query }, { $set: { [`${prop}.$.status`]: 'deleted' } }, { runValidators: true })
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
