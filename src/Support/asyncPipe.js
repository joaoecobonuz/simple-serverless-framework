const asyncPipe = (...fns) => (...args) => fns.reduce((p, f) => p.then(f), Promise.resolve(...args))

export default asyncPipe
