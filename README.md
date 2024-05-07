# Movie archive

## What's this?

Movie Archive is a basic CRUD system for films. It was developed to serve as a testing API for frontend projects.

## Stack
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)

## Endpoints overview
- Movies: `GET`, `POST`, `PATCH`, `DELETE`
- Artists: `GET`, `POST`, `PATCH`, `DELETE`
- Countries: `GET`
- Genres: `GET`
- Languages: `GET`

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

```
docker compose up
```

#### Stop Docker server

```
docker compose down
```

### Run migrations and seeders

Create the collections in the DB and populate the static collections with its data.
There are seeders for genres, languages, and countries.

```
node ./server/scripts/migration.js
```

### Run development server with Nodemon

```
npm run start
```

## Testing

### Run tests

Tests don't need to use MongoDB. They use in-memory database.

```
npm run tests
```
