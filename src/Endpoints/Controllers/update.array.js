import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
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
      const update = Object.entries(body).reduce((state, [key, value]) => ({
        ...state,
        [`${prop}.$.${key}`]: value
      }), {})
      await $model.findOneAndUpdate(
        { _id: id, [`${prop}._id`]: body._id, ...query },
        { $set: update },
        { runValidators: true }
      )
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
