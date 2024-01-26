FROM node:latest

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY './dist' .

CMD ["node", "./database/seeders/seed.js"]