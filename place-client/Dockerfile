FROM node:16-alpine as builder

WORKDIR /app
COPY . ./
RUN npm install && npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80