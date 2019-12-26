# mode passed from dockerfile entrypoint
if [ "$1" = "prod" ]; then
  echo window.API_URL=\"$API_URL\" > /var/www/html/config.js
fi
envsubst '$SERVER_NAME' < /nginx.template.conf > /etc/nginx/conf.d/default.conf
# run nginx in foreground
nginx -g 'daemon off;'
