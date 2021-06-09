import MongoQL from './MongoQL'

export default (callback) => callback({
  hasOne: MongoQL.hasOne,
  hasMany: MongoQL.hasMany
})
