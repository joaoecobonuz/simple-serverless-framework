import fs from 'fs'
import yaml from 'write-yaml'
import state from './state'
import { readModules } from './utils'
import { capitalize } from 'lodash'

const capitalizeKebabCase = (value) => value.split('-').map(capitalize).join('')
const serviceName = (name, suffix) => `${capitalizeKebabCase(name)}${suffix}`
const kebabCase = (...values) => values.join('-')
const topicRef = (value) => `!Ref ${serviceName(value, 'Topic')}`

const runEndpoints = (module) => {
  const versions = fs.readdirSync(`src/modules/${module}/endpoints`)
  versions.forEach(version => {
    const endpoints = fs.readdirSync(`src/modules/${module}/endpoints/${version}`)
    endpoints.forEach(endpoint => {
      require(`${process.cwd()}/src/modules/${module}/endpoints/${version}/${endpoint}`)
    })
  })
}
const runConsumers = (module) => {
  const consumers = fs.readdirSync(`src/modules/${module}/consumers`)
  consumers.forEach(consumer => {
    require(`${process.cwd()}/src/modules/${module}/consumers/${consumer}`)
  })
}
const runSchedules = (module) => {
  const schedules = fs.readdirSync(`src/modules/${module}/schedules`)
  schedules.forEach(schedule => {
    require(`${process.cwd()}/src/modules/${module}/schedules/${schedule}`)
  })
}

const buildServiceName = (value, { name }) => serviceName(name, value)
const buildService = (value, service, callback) => value.reduce((result, item) => ({
  ...result,
  [buildServiceName(service, item)]: callback(item)
}), {})

const prepareState = (state) => {
  const modules = readModules()

  modules.forEach(module => {
    runEndpoints(module)
    runConsumers(module)
    runSchedules(module)
  })

  return Promise.resolve(state)
}

const buildModuleTopics = (state) => buildService(state.topics, 'Topic', ({ name }) => ({
  Type: 'AWS::SNS::Topic',
  Properties: {
    TopicName: kebabCase(name, state.config.stage)
  }
}))
const buildModuleConsumers = (state) => buildService(state.consumers, 'Consumer', ({ name, options }) => ({
  Type: 'AWS::SNS::Queue',
  Properties: {
    QueueName: kebabCase(name, state.config.stage),
    VisibilityTimeout: options.timeout,
    FifoQueue: options.fifo
  }
}))
const buildModuleSubscriptions = (state) => buildService(state.consumers, 'Subscription', ({ topic, name }) => ({
  Type: 'AWS::SNS::Subscription',
  Properties: {
    TopicArn: topicRef(topic),
    Endpoint: {
      'Fn::GetAtt:': [
        serviceName(name, 'Queue'),
        'Arn'
      ]
    },
    Protocol: 'sqs'
  }
}))
const buildModuleResources = (state) => {
  const topics = buildModuleTopics(state)
  const consumers = buildModuleConsumers(state)
  const subscriptions = buildModuleSubscriptions(state)

  yaml.sync('./serverless.modules.resources.yml', {
    ...topics,
    ...consumers,
    ...subscriptions
  })

  return Promise.resolve(state)
}
const buildModulesEndpoints = (state) => {
  const endpoints = buildService(state.endpoints, 'Endpoint', ({ module, version, name, path, options }) => ({
    name: kebabCase('endpoints', name, state.config.stage),
    handler: `${path}.handler`,
    timeout: 30,
    events: [
      {
        http: {
          path: `${module}/${version}/${options.path}${options.params}`,
          method: options.method
        }
      }
    ]
  }))

  yaml.sync('./serverless.modules.endpoints.yml', endpoints)

  return Promise.resolve(state)
}
const buildModulesConsumers = (state) => {
  const consumers = buildService(state.consumers, 'Consumer', ({ name, path, options }) => ({
    name: kebabCase('consumers', name, state.config.stage),
    handler: `${path}.handler`,
    timeout: options.timeout,
    reservedConcurrency: options.concurrency,
    events: [
      {
        sqs: {
          arn: {
            'Fn::GetAtt': [
              serviceName(name, 'Queue'),
              'Arn'
            ]
          },
          batchSize: 1,
          enabled: true
        }
      }
    ]
  }))

  yaml.sync('./serverless.modules.consumers.yml', consumers)

  return Promise.resolve(state)
}
const buildModulesSchedules = (state) => {
  const schedules = buildService(state.schedules, 'Schedule', ({ name, path, options }) => ({
    name: kebabCase('schedules', name, state.config.stage),
    handler: `${path}.handler`,
    timeout: options.timeout,
    events: [
      {
        schedule: {
          rate: options.rate,
          enabled: true
        }
      }
    ]
  }))

  yaml.sync('./serverless.modules.schedules.yml', schedules)

  return Promise.resolve(state)
}

const init = (config) => {
  state.setConfig(config)
  prepareState(state)
    .then(buildModuleResources)
    .then(buildModulesEndpoints)
    .then(buildModulesConsumers)
    .then(buildModulesSchedules)
}

export default init
