import jsonWebToken from 'jsonwebtoken'
import state from '../../state'

export default ({ isPublic }) => (req) => {
  if (!state.config.endpoints.secret) {
    return req
  }

  if (isPublic) {
    return req
  }

  try {
    jsonWebToken.verify(req.token, config.endpoints.secret)
    return req
  } catch (err) {
    throw { status: 401, message: 'Unauthorized' }
  }
}
