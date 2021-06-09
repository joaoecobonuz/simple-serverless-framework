import { model, Schema } from 'mongoose'
import schema from './schema'

const SCHEMA = new Schema(schema, { timestamps: true })

const Model = model('loggers', SCHEMA, 'loggers')

export default Model
