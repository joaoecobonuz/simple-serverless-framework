import LoggersModel from './model'

const start = (id) => async (req) => {
  await LoggersModel({ id, request: JSON.stringify(req) }).save()
  return req
}

const success = (id) => async (res) => {
  await LoggersModel.findOneAndUpdate({ id }, { response: JSON.stringify(res), finishedAt: new Date(), status: 'success' })
  return res
}

const error = (id) => async (err) => {
  console.log(err)
  await LoggersModel.findOneAndUpdate({ id }, { error: JSON.stringify(err), finishedAt: new Date(), status: 'error' })
  return err
}

export default {
  start,
  success,
  error
}
