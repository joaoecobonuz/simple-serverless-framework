# simple-serverless-framework

[![NPM version](https://img.shields.io/npm/v/simple-serverless-framework.svg?style=flat-square)](https://npmjs.org/package/simple-serverless-framework)
[![Build Status](https://img.shields.io/travis/jgtb/simple-serverless-framework/master.svg?style=flat-square)](https://travis-ci.org/jgtb/simple-serverless-framework) [![Coverage Status](https://img.shields.io/codecov/c/github/jgtb/simple-serverless-framework/master.svg?style=flat-square)](https://codecov.io/gh/jgtb/simple-serverless-framework/branch/master)

## Features

-   [**AWS SDK**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline SQS**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Serverless Offline Scheduler**](https://babeljs.io/) - Write next generation JavaScript today.
-   [**Mongoose**](https://babeljs.io/) - Write next generation JavaScript today.

## Installation

This library is published in the NPM registry and can be installed using any compatible package manager.

```sh
npm install simple-serverless-framework --save

# For Yarn, use the command below.
yarn add simple-serverless-framework
```

### Installation from CDN

This module has an UMD bundle available through JSDelivr and Unpkg CDNs.

```html
<!-- For UNPKG use the code below. -->
<script src="https://unpkg.com/simple-serverless-framework"></script>

<!-- For JSDelivr use the code below. -->
<script src="https://cdn.jsdelivr.net/npm/simple-serverless-framework"></script>

<script>
  // UMD module is exposed through the "SimpleServerlessFramework" global variable.
  console.log(SimpleServerlessFramework);
</script>
```

## Usage

### Initialization

```js
SimpleServerlessFramework.init({
  database: {
    URI: '' // connects to mongoose before any Consumers, Endpoints or Schedules
  },
  endpoints: {
    secret: '', // used to token authenticate
    middlewares: [], // middlewares that will run before any endpoint
    middlewaresAfterAuthenticate: [] // middlewares that will run after any endpoint
  },
  aws: {
    id: '', // AWS ID Account (required)
    region: '' // AWS Region (required)
  },
  stage: '' // dev or prod (required)
})
```

### Database

```js
SimpleServerlessFramework.Database.model({
})

SimpleServerlessFramework.Database.schema({
})

SimpleServerlessFramework.Database.relationships({
})
```

### Services

```js
SimpleServerlessFramework.Services.register({
})
```

### Consumers

```js
SimpleServerlessFramework.Services.register({
})
```

### Endpoints

```js
SimpleServerlessFramework.Endpoints.register({
})

SimpleServerlessFramework.Endpoints.Controllers.list({
})

SimpleServerlessFramework.Endpoints.Controllers.listArray({
})

SimpleServerlessFramework.Endpoints.Controllers.details({
})

SimpleServerlessFramework.Endpoints.Controllers.detailsArray({
})

SimpleServerlessFramework.Endpoints.Controllers.create({
})

SimpleServerlessFramework.Endpoints.Controllers.createArray({
})

SimpleServerlessFramework.Endpoints.Controllers.update({
})

SimpleServerlessFramework.Endpoints.Controllers.updateArray({
})

SimpleServerlessFramework.Endpoints.Controllers.activateDeactivate({
})

SimpleServerlessFramework.Endpoints.Controllers.activateDeactivateArray({
})

SimpleServerlessFramework.Endpoints.Controllers.softDelete({
})

SimpleServerlessFramework.Endpoints.Controllers.softDeleteArray({
})

SimpleServerlessFramework.Endpoints.Controllers.delete({
})

SimpleServerlessFramework.Endpoints.Controllers.deleteArray({
})
```

### Schedules

```js
SimpleServerlessFramework.Schedules.register({
})
```
