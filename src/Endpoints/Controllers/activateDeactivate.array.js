import register from '../register'
import { getContext, getDatabaseModel } from '../../utils'

export default ({ prop, middlewares, isPublic }) => register({
  method: 'PATCH',
  params: '/:id/:document',
  middlewares,
  isPublic,
  async handler (req) {
    const { module } = getContext()
    const $model = getDatabaseModel({ module })
    const { query, params } = req
    const { id, document } = params
    try {
      await $model.findOneAndUpdate(
        { _id: id, ...query },
        [
          {
            $set: {
              [prop]: {
                $reduce: {
                  input: '$items',
                  initialValue: [],
                  in: {
                    $cond: [
                      { $eq: ['$$this._id', document] },
                      {
                        $concatArrays: [
                          '$$value',
                          [
                            {
                              $mergeObjects: [
                                '$$this',
                                {
                                  status: {
                                    $switch: {
                                      branches: [
                                        { case: { $eq: [ '$$this.status', 'inactive' ] }, then: 'active' },
                                        { case: { $eq: [ '$$this.status', 'active' ] }, then: 'inactive' }
                                      ],
                                      default: 'inactive'
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        ]
                      },
                      { $concatArrays: [ '$$value', ['$$this'] ] }
                    ]
                  }
                }
              }
            }
          }
        ],
        { runValidators: true }
      )
      return { status: 200, message: 'Ok' }
    } catch (error) {
      throw { status: 400, message: 'Error' }
    }
  }
})
