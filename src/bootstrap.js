import Database from './Database'

let app

const bootstrap = async () => {
  if (!app) {
    app = await Database.connect()
  }
}

export default bootstrap
