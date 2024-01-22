# Movie archive

## What's this?

Movie Archive is a basic CRUD system for films

## Stack
* JavaScript
* Express
* MongoDB

## Set .env files

Copy `.env.example` to `.env` and set the constants values.

```
MONGO_PORT=27017
MONGO_ROOT_USERNAME=mvarchive
MONGO_ROOT_PASSWORD=password
NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=5000
```

## Run development server

### Start Docker server for development

`$ docker compose up`

### Stop Docker server

`$ docker compose down`

## Run migrations and seeders

`$ node ./server/scripts/migration.js`

## Run server tests

`npm run tests`
