import { uniqBy } from 'lodash'

const state = {
  topics: [],
  consumers: [],
  schedules: [],
  endpoints: [],
  config: {
    database: {
      URI: ''
    },
    endpoints: {
      secret: '',
      middlewares: [],
      middlewaresAfterAuthenticate: []
    },
    aws: {
      id: '',
      region: ''
    },
    stage: ''
  },
  addTopic: function (value) {
    this.topics = uniqBy('name', [...this.topics, value])
  },
  addConsumer: function (value) {
    this.consumers = [...this.consumers, value]
  },
  addSchedule: function (value) {
    this.schedules = [...this.schedules, value]
  },
  addEndpoint: function (value) {
    this.endpoints = [...this.endpoints, value]
  },
  setConfig: function (value) {
    this.config = value
  }
}

export default state
