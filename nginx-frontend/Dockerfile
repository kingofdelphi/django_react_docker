FROM node:12.13.1 as build-frontend

WORKDIR /app
COPY ./frontend/package*.json /app/
RUN yarn install
COPY ./frontend/ /app/
RUN yarn build



FROM nginx

# override default conf of nginx
COPY ./nginx-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# copy static files
COPY --from=build-frontend /app/build/ /var/www/html

