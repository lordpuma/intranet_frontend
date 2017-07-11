FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf:ro
COPY ./dist /srv/http/intranet


EXPOSE 80
