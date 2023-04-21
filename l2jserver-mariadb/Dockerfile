FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.17.2" \
      mariadb-version="2.6.6.0" \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-mariadb" \
      org.opencontainers.image.description="L2JServer MariaDB Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.vendor="L2JServer" \
      org.opencontainers.image.version="2.6.6.0" \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_SOURCE="/opt/l2jserver/git"

ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"

RUN apk update && apk --no-cache add git mariadb mariadb-client mariadb-server-utils pwgen

RUN git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker"
RUN mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/entrypoint" "$PATH_SERVER/entrypoint" && chmod +x "$PATH_SERVER/entrypoint"
RUN ln -s "$PATH_SERVER/entrypoint" /bin/entrypoint

RUN apk del git
RUN rm "$PATH_SOURCE" -R -f
RUN rm -R -f /var/cache/apk/*

EXPOSE 3306

ENTRYPOINT entrypoint