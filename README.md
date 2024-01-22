# Movie archive

## What's this?

Movie Archive is a basic CRUD system for films. It's was developed to serve as a testing API for frontend projects.

## Stack
* Node.js
* Express
* MongoDB

## Endpoints overview
- Movies: GET, POST, PATCH, DELETE
- Artists: GET, POST, PATCH, DELETE
- Countries: GET
- Genres: GET
- Languages: GET

## Development environment

### Run MongoDB with Docker

#### Set .env files

Copy `.env.example` to `.env` and set the constants values.

```
MONGODB_CNN=mongodb://mongouser:password@mongo:27017/movie-archive            
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DB_NAME=movie-archive
MONGO_ROOT_USERNAME=mvarchiveroot
MONGO_ROOT_PASSWORD=rootpassword
NODE_ENV=development

DEV_BASE_URL=http://localhost:3000
```

#### Start Docker server

`docker compose up`

#### Stop Docker server

`docker compose down`

### Run migrations and seeders

Create the collections in the DB and populate the static collections with its data.
There are seeders for genres, languages and countries.

`node ./server/scripts/migration.js`

### Run development server with Nodemon

`npm run start`

## Testing

### Run tests

Tests don't need to use MongoDB. They use in-memory database.

`npm run tests`
