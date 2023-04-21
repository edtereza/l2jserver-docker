FROM alpine:3.16
MAINTAINER EDTech Solutions <support@edtech.tec.br>
LABEL os="Ubuntu" \
      name="Login Server" \
      version="2.6.6.0" \
      vendor="L2JServer" \
      contact="support@edtech.tec.br"
      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_SOURCE="/opt/l2jserver/git"

ENV HTTP_SOURCE_DOCKER="https://bitbucket.org/edtech-source/l2j-server-docker.git"

RUN apk update && apk --no-cache add git mariadb mariadb-client mariadb-server-utils pwgen

RUN git clone --branch master --single-branch "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker"
RUN mv "$PATH_SOURCE/l2j-server-docker/l2jserver-mariadb/entrypoint" "$PATH_SERVER/entrypoint" && chmod +x "$PATH_SERVER/entrypoint"
RUN ln -s "$PATH_SERVER/entrypoint" /bin/entrypoint

RUN apk del git
RUN rm "$PATH_SOURCE" -R -f
RUN rm -R -f /var/cache/apk/*

EXPOSE 3306

ENTRYPOINT entrypoint