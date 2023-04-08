# Movie archive

A basic CRUD system for films

## Install dependencies

`cd server`

`npm install`

## Set .env files

There are two .env files.

The first one is in the root directory.
Copy .env.example to .env and set the constants values.

`
MONGO_PORT=27017
MONGO_ROOT_USERNAME=mvarchive
MONGO_ROOT_PASSWORD=
MONGO_EXPRESS_PORT=8081
NODE_LOCAL_PORT=6868
NODE_DOCKER_PORT=5000
`

Copy the ./server/.env.example to ./server/.env and set the constant values.

`
MONGODB_CNN=mongodb://localhost:27017/movie-archive
MONGO_DB_NAME=movie-archive
MONGO_DB_PASSWORD=
DEV_BASE_URL=http://localhost:3000
`

## Run server

### Start Docker server for development

`$ docker compose up`

### Stop Docker server

`$ docker compose down`

### Use nodemon to start Node.js server

`nodemon server/index.js`

## Run server tests

`npm run tests`
