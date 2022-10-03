FROM node:16-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm i typescript -g

RUN tsc

EXPOSE 7676
CMD [ "node", "./dist/index.js" ]