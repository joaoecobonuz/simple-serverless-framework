import AWS from '../AWS'
import Loggers from '../Loggers'
import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, getService, kebabize } from '../utils'

const register = ({ rate, timeout = 900, handler }) => {
  const { module, file, path } = getContext()
  const $service = getService({ module })

  const schedule = kebabize(file)

  const moduleSchedule = `${module}-${schedule}`

  state.addSchedule({
    name: moduleSchedule,
    path,
    options: {
      rate,
      timeout
    }
  })

  return async (event, context) => {
    const id = context.awsRequestId
    const message = AWS.SNS.decodeMessage(event)
    try {
      await bootstrap()
      await Loggers.start(id)(message)
      const response = await handler(message).bind({ $service })
      await Loggers.success(id)(response)
    } catch (error) {
      await Loggers.error(id)(error)
    }
  }
}

export default register
