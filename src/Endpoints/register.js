import Middlewares from './Middlewares'
import Loggers from '../Loggers'
import Support from '../Support'
import bootstrap from '../bootstrap'
import state from '../state'
import { getContext, getService, kebabize } from '../utils'

const register = ({ method, params = '', middlewares, handler, isPublic }) => {
  const { module, version, file, path } = getContext()
  const $service = getService({ module })

  const moduleEndpoint = `${module}-${file}`
  const endpoint = kebabize(file)

  state.addEndpoint({
    module,
    version,
    name: moduleEndpoint,
    path,
    options: {
      method,
      path: endpoint,
      params
    }
  })

  return async (event, context) => {
    const id = context.awsRequestId
    try {
      await bootstrap()

      const { queryStringParameters, pathParameters, body, headers } = event

      const request = {
        headers,
        query: queryStringParameters ?? {},
        params: pathParameters ?? {},
        body: body ? JSON.parse(body) : {}
      }

      const options = {
        isPublic
      }

      const execute = Support.asyncPipe(
        Middlewares.paginate(options),
        Middlewares.sort(options),
        Middlewares.query(options),
        Middlewares.decode(options),
        ...state.config.endpoints.middlewares,
        Loggers.start(id),
        Middlewares.authenticate(options),
        ...state.config.endpoints.middlewaresAfterAuthenticate,
        ...middlewares,
        handler.bind({ $service }),
        Loggers.success(id)
      )
  
      const result = await execute(request)
  
      const response = {
        statusCode: 200,
        body: JSON.stringify(result)
      }
      return response
    } catch (error) {
      await Loggers.error(id)(error)
      const response = {
        statusCode: error.status ?? 500,
        body: JSON.stringify(error)
      }
      return response
    }
  }
}

export default register
