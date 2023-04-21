FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.17.2" \
      l2jserver-version="2.6.6.0" \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-login" \
      org.opencontainers.image.description="L2JServer Login Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.vendor="L2JServer" \
      org.opencontainers.image.version="2.6.6.0" \
      org.opencontainers.image.url="https://hub.docker.com/r/yobasystems/alpine-mariadb/" \
      org.opencontainers.image.source="https://bitbucket.org/edtech-source/l2j-server-docker"
      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_CLIENT="/opt/l2jserver/cli"
ENV PATH_SOURCE="/opt/l2jserver/git"

ENV HTTP_SOURCE_LOGIN="https://bitbucket.org/l2jserver/l2j-server-login.git"
ENV HTTP_SOURCE_CLIENT="https://github.com/edtereza/l2jserver-cli.git
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"

RUN apk update && apk --no-cache add git maven mariadb-client unzip openjdk17-jdk
RUN mkdir -p "$PATH_SOURCE"

RUN git clone --branch master --single-branch "$HTTP_SOURCE_LOGIN" "$PATH_SOURCE/l2j-server-login"
RUN cd "$PATH_SOURCE/l2j-server-login" && chmod +x mvnw && ./mvnw install
RUN unzip "$PATH_SOURCE/l2j-server-login/target/*.zip" -d "$PATH_SERVER"

RUN git clone --branch master --single-branch "$HTTP_SOURCE_CLIENT" "$PATH_SOURCE/l2j-server-cli"
RUN cd "$PATH_SOURCE/l2j-server-cli" && chmod +x mvnw && ./mvnw install
RUN unzip "$PATH_SOURCE/l2j-server-cli/target/*.zip" -d "$PATH_CLIENT"
RUN chmod +x "$PATH_CLIENT/l2jcli.sh"

RUN git clone --branch master --single-branch "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker"
RUN mv "$PATH_SOURCE/l2j-server-docker/l2jserver-login/entrypoint" "$PATH_SERVER/entrypoint" && chmod +x "$PATH_SERVER/entrypoint"
RUN ln -s "$PATH_SERVER/entrypoint" /bin/entrypoint

RUN apk del maven git unzip openjdk17-jdk
RUN apk update && apk --no-cache add openjdk17-jre
RUN rm "$PATH_SOURCE" -R -f
RUN rm -R -f /var/cache/apk/*

EXPOSE 9014 2106

WORKDIR /opt/l2jserver

ENTRYPOINT entrypoint