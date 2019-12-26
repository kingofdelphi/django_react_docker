# mode passed from dockerfile entrypoint
echo window.API_URL=\"$API_URL\" > /var/www/html/config.js
envsubst '$SERVER_NAME' < /nginx.conf > /test.conf
cp /nginx.conf /etc/nginx/conf.d/default.conf
# run nginx in foreground
nginx -g 'daemon off;'
