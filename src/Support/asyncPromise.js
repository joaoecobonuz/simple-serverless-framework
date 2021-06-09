const asyncPromise = (value, process, result = (value) => value) => {
  const promises = value.map(process)
  const data = await Promise.all(promises)
  return result(data)
}

export default asyncPromise
