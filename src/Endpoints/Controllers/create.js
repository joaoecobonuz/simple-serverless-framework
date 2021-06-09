import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ middlewares, isPublic }) => register({
  method: 'POST',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { body } = req
    try {
      await $model(body).save()
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
