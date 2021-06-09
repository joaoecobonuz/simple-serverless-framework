const buildProject = (modules, fields) => {
  const root = {}
  const result = {}
  modules.forEach(module => {
    result[module] = { _id: 1 }
    fields.forEach(field => {
      root[field] = 1
      const props = field.split(module)
      if (props.length === 2) {
        const [_, name] = props
        result[module] = {
          ...(result[module] || {}),
          [name.substring(1)]: 1
        }
      }
    })
  })

  return {
    root,
    ...result
  }
}

export default buildProject
