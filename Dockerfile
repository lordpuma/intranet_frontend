FROM nginx

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./dist /srv/http/intranet


EXPOSE 80
