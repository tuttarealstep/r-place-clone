FROM node:16-alpine as builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm i

EXPOSE 8787
CMD [ "node", "./dist/index.js" ]