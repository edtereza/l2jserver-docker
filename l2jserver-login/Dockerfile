FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.16.5" \
      l2jserver-version="2.6.6.0" \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-login" \
      org.opencontainers.image.description="L2JServer Login Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.version="2.6.6.0" \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
#
# Enviroment PATH
#      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_CLIENT="/opt/l2jserver/cli"
ENV PATH_SOURCE="/opt/source"
#
# Enviroment GIT REPOSITORIES
#      
ENV HTTP_SOURCE_LOGIN="https://bitbucket.org/l2jserver/l2j-server-login.git"
ENV HTTP_SOURCE_CLIENT="https://github.com/edtereza/l2jserver-cli.git"
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"
#
# Dependences
#
RUN apk update && apk --no-cache add tzdata git maven mariadb-client unzip openjdk17-jdk cracklib && \
    mkdir -p "$PATH_SERVER" && \
    mkdir -p "$PATH_CLIENT" && \
    mkdir -p "$PATH_SOURCE"
#
# L2J Login Server    
#
RUN git clone --branch master --single-branch "$HTTP_SOURCE_LOGIN" "$PATH_SOURCE/l2j-server-login" && \
    cd "$PATH_SOURCE/l2j-server-login" && chmod +x mvnw && ./mvnw install && \
    unzip "$PATH_SOURCE/l2j-server-login/target/*.zip" -d "$PATH_SERVER" && \
    rm "$PATH_SOURCE/l2j-server-login" -f -R
#
# L2J Client
#
RUN git clone "$HTTP_SOURCE_CLIENT" "$PATH_SOURCE/l2j-server-cli" && \
    cd "$PATH_SOURCE/l2j-server-cli" && chmod +x mvnw && ./mvnw install && \
    unzip "$PATH_SOURCE/l2j-server-cli/target/*.zip" -d "$PATH_CLIENT" && \
    rm "$PATH_SOURCE/l2j-server-cli" -f -R
#
# L2J Docker Engine
#
RUN git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker" && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-login/entrypoint" /bin/entrypoint && \
    mv "$PATH_SOURCE/l2j-server-docker/l2jserver-login/healthcheck" /bin/healthcheck
#
# CHMOD for execution
#
RUN chmod +x "$PATH_CLIENT/l2jcli.sh" && \
    chmod +x /bin/entrypoint && \
    chmod +x /bin/healthcheck
#
# CleanUP
#
RUN apk del maven git unzip && \
    rm "$PATH_SOURCE" -R -f && \
    rm -R -f /var/cache/apk/*
#
# Default Ports
#
EXPOSE 9014 2106
#
# Workdir and Entrypoint (container startup)
#
WORKDIR /opt/l2jserver
ENTRYPOINT entrypoint