FROM node:latest

WORKDIR /usr/src/app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

