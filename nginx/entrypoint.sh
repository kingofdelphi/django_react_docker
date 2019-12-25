#!/bin/sh
# mode passed from dockerfile entrypoint
envsubst '$SERVER_NAME' < /nginx.conf > /test.conf
cp /nginx.conf /etc/nginx/conf.d/default.conf
# run nginx in foreground
nginx -g 'daemon off;'
