FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.16.5" \
      php-version="8.1.18" \
      nginx-version="1.22.1" \      
      org.opencontainers.image.os="Alpine Linux v3.16" \
      org.opencontainers.image.title="l2jserver-web" \
      org.opencontainers.image.description="L2JServer Web Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.version="1.0.0.0" \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
#
# Enviroment PATH
#   
ENV PATH_NGINX="/etc/nginx"
ENV PATH_SOURCE="/opt/source"
#
# Enviroment GIT REPOSITORIES
# 
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"
#
# Dependences
#
RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community php && \
    apk update && apk --no-cache add tzdata git unzip zip nginx php8-fpm php8-pecl-mcrypt php8-soap php8-openssl php8-gmp php8-pdo_odbc php8-json php8-dom php8-pdo php8-zip php8-mysqli php8-sqlite3 php8-apcu php8-pdo_pgsql php8-bcmath php8-gd php8-odbc php8-pdo_mysql php8-pdo_sqlite php8-gettext php8-xmlreader php8-bz2 php8-iconv php8-pdo_dblib php8-curl php8-ctype && \
    adduser -D -g 'www' www  && \
    mkdir -p "$PATH_SOURCE"
#
# L2J Docker Engine
#
RUN git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker" && \
    rm "$PATH_NGINX" -R -f  && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-web/nginx" "$PATH_NGINX" && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-web/entrypoint" "/bin/entrypoint" && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-web/healthcheck" "/bin/healthcheck"
#
# CHMOD for execution
#
RUN chmod +x "/bin/entrypoint" && \
    chmod +x "/bin/healthcheck"
#
# CleanUP
#
RUN apk del git && \
    rm "$PATH_SOURCE" -R -f && \
    rm -R -f /var/cache/apk/*
#
# Default Ports
#
EXPOSE 80
#
# Workdir and Entrypoint (container startup)
#
WORKDIR /etc/nginx
ENTRYPOINT entrypoint