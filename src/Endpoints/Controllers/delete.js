import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ middlewares, isPublic }) => register({
  method: 'DELETE',
  params: '/:id',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params } = req
    const { id } = params
    try {
      await $model.findOneAndDelete({ _id: id, ...query }, { runValidators: true })
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
