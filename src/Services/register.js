import { getContext, getDatabaseModel, getServices } from '../utils'

const register = ({ withState = false, handler }) => {
  const { module } = getContext()
  const $model = getDatabaseModel({ module })
  const $services = getServices()

  return {
    withState,
    handler: ($state) => handler.bind({
      $model,
      $state,
      ...$services
    })
  }
}

export default register
