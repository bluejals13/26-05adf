FROM node:20-alpine AS frontend-build

WORKDIR /app

COPY ./frontend/ .

RUN npm install
RUN npm run build

FROM nginx:alpine

COPY --from=frontend-build /app/dist /usr/share/nginx/html

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
