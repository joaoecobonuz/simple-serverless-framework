import AWS from '../AWS'
import Loggers from '../Loggers'
import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, getService, kebabize } from '../utils'

const register = ({ topic, concurrency = 1, timeout = 900, fifo = false, handler }) => {
  const { module, path, file } = getContext()
  const $service = getService({ module })

  const consumer = kebabize(file)

  const moduleTopic = `${module}-${topic}`
  const moduleConsumer = `${module}-${consumer}`

  state.addTopic({
    name: moduleTopic
  })

  state.addConsumer({
    topic: moduleTopic,
    name: moduleConsumer,
    path,
    options: {
      concurrency,
      timeout,
      fifo
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
