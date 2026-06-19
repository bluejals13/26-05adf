FROM nginx:alpine

# frontend build 결과 복사
COPY ../frontend/dist /usr/share/nginx/html

COPY ./default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
