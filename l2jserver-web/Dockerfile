FROM alpine:3.11
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
RUN wget https://php.hernandev.com/key/php-alpine.rsa.pub -o /etc/apk/keys/php-alpine.rsa.pub && \
    apk update && apk upgrade && \ 
    apk add ca-certificates tzdata git unzip zip nginx php php7-fpm php7-pecl-mcrypt php7-soap php7-openssl php7-gmp php7-pdo_odbc php7-json php7-dom php7-pdo php7-zip php7-mysqli php7-sqlite3 php7-apcu php7-pdo_pgsql php7-bcmath php7-gd php7-odbc php7-pdo_mysql php7-pdo_sqlite php7-gettext php7-xmlreader php7-bz2 php7-iconv php7-pdo_dblib php7-curl php7-ctype && \
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