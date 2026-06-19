FROM node:20-alpine AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# 결과물만 남기고 끝 (서버 아님)
FROM alpine

CMD ["echo", "frontend build completed"]

