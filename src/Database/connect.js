import mongoose from 'mongoose'
import state from '../state'

const connect = () => mongoose
  .connect(state.config.database.URI, { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true })

export default connect
