FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.16.5" \
      mariadb-version="10.6.12 " \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-mariadb" \
      org.opencontainers.image.description="L2JServer MariaDB Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.version="10.6.12 " \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
#
# Enviroment PATH
#  
ENV PATH_SOURCE="/opt/source"
#
# Enviroment GIT REPOSITORIES
#  
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"
#
# Dependences
#
RUN apk update && apk --no-cache add git tzdata mariadb mariadb-client mariadb-server-utils pwgen cracklib
#
# L2J Docker Engine
#
RUN git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker" && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/entrypoint" /bin/entrypoint && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/healthcheck" /bin/healthcheck
#
# CleanUP
#
RUN apk del git && \
    rm "$PATH_SOURCE" -R -f && \
    rm -R -f /var/cache/apk/*
#
# CHMOD for execution
#
RUN chmod +x /bin/entrypoint && \
    chmod +x /bin/healthcheck
#
# Default Ports
#
EXPOSE 3306
#
# Entrypoint (container startup)
#
ENTRYPOINT entrypoint