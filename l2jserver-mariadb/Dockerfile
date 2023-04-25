FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.17.2" \
      mariadb-version="10.6.12 " \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-mariadb" \
      org.opencontainers.image.description="L2JServer MariaDB Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.version="10.6.12 " \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_SOURCE="/opt/l2jserver/source"
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"

RUN apk update && apk --no-cache add git tzdata mariadb mariadb-client mariadb-server-utils pwgen cracklib && \
    git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker" && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/entrypoint" "$PATH_SERVER/entrypoint" && chmod +x "$PATH_SERVER/entrypoint" && \
    ln -s "$PATH_SERVER/entrypoint" /bin/entrypoint && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/healthcheck" "$PATH_SERVER/healthcheck" && chmod +x "$PATH_SERVER/healthcheck" && \
    ln -s "$PATH_SERVER/healthcheck" /bin/healthcheck && \
    apk del git && \
    rm "$PATH_SOURCE" -R -f && \
    rm -R -f /var/cache/apk/*

EXPOSE 3306

ENTRYPOINT entrypoint