FROM alpine:3.16
MAINTAINER Erik Douglas Tereza <erik.d.tereza@gmail.com>
LABEL maintainer="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      architecture="amd64/x86_64" \
      alpine-version="3.17.2" \
      l2jserver-version="2.6.6.0" \      
      org.opencontainers.image.os="Alpine Linux" \
      org.opencontainers.image.title="l2jserver-game" \
      org.opencontainers.image.description="L2JServer Game Server image running on Alpine Linux" \
      org.opencontainers.image.authors="Erik Douglas Tereza <erik.d.tereza@gmail.com>" \
      org.opencontainers.image.version="2.6.6.0" \
      org.opencontainers.image.source="https://github.com/edtereza/l2jserver-docker.git"
      
ENV PATH_SERVER="/opt/l2jserver"
ENV PATH_CLIENT="/opt/l2jserver/cli"
ENV PATH_SOURCE="/opt/l2jserver/source"

ENV HTTP_SOURCE_GAME="https://bitbucket.org/l2jserver/l2j-server-game.git"
ENV HTTP_SOURCE_DATAPACK="https://bitbucket.org/l2jserver/l2j-server-datapack.git"
ENV HTTP_SOURCE_GEODATA="https://bitbucket.org/l2jgeo/l2j_geodata.git"
ENV HTTP_SOURCE_CLIENT="https://github.com/edtereza/l2jserver-cli.git"
ENV HTTP_SOURCE_DOCKER="https://github.com/edtereza/l2jserver-docker.git"

RUN apk update && apk --no-cache add git maven mariadb-client unzip cracklib openjdk17-jdk

RUN mkdir -p "$PATH_SOURCE"

RUN git clone --branch master --single-branch "$HTTP_SOURCE_GAME" "$PATH_SOURCE/l2j-server-game" 
RUN cd "$PATH_SOURCE/l2j-server-game" && chmod +x mvnw && ./mvnw install -DskipTests
RUN unzip "$PATH_SOURCE/l2j-server-game/target/*.zip" -d "$PATH_SERVER"
RUN rm "$PATH_SOURCE/l2j-server-game" -R -f

RUN git clone --branch master --single-branch "$HTTP_SOURCE_DATAPACK" "$PATH_SOURCE/l2j-server-datapack"
RUN cd "$PATH_SOURCE/l2j-server-datapack" && chmod +x mvnw && ./mvnw install -DskipTests
RUN unzip "$PATH_SOURCE/l2j-server-datapack/target/*.zip" -d "$PATH_SERVER"
RUN rm "$PATH_SOURCE/l2j-server-datapack" -R -f

RUN git clone --branch master --single-branch "$HTTP_SOURCE_GEODATA" "$PATH_SOURCE/l2j-server-geodata"
RUN mv "$PATH_SOURCE/l2j-server-geodata/geodata" "$PATH_SERVER"
RUN rm "$PATH_SOURCE/l2j-server-geodata" -R -f

RUN git clone "$HTTP_SOURCE_CLIENT" "$PATH_SOURCE/l2j-server-cli"
RUN cd "$PATH_SOURCE/l2j-server-cli" && chmod +x mvnw && ./mvnw install
RUN unzip "$PATH_SOURCE/l2j-server-cli/target/*.zip" -d "$PATH_CLIENT"
RUN rm "$PATH_SOURCE/l2j-server-cli" -R -f
RUN chmod +x "$PATH_CLIENT/l2jcli.sh"

RUN mv "$PATH_SERVER/data" "$PATH_SERVER/data.d"
RUN mv "$PATH_SERVER/config" "$PATH_SERVER/config.d"
RUN mv "$PATH_SERVER/script" "$PATH_SERVER/script.d"
RUN mkdir -p "$PATH_SERVER/data"
RUN mkdir -p "$PATH_SERVER/config"
RUN mkdir -p "$PATH_SERVER/script"

RUN git clone "$HTTP_SOURCE_DOCKER" "$PATH_SOURCE/l2j-server-docker"
RUN mv "$PATH_SOURCE/l2j-server-docker/l2jserver-game/entrypoint" "$PATH_SERVER/entrypoint" && chmod +x "$PATH_SERVER/entrypoint"
RUN ln -s "$PATH_SERVER/entrypoint" /bin/entrypoint
RUN mv "$PATH_SOURCE/l2j-server-docker/l2jserver-game/healthcheck" "$PATH_SERVER/healthcheck" && chmod +x "$PATH_SERVER/healthcheck"
RUN ln -s "$PATH_SERVER/healthcheck" /bin/healthcheck

RUN apk del maven git unzip
RUN rm "$PATH_SOURCE" -R -f
RUN rm /var/cache/apk/* -R -f

EXPOSE 7777

WORKDIR /opt/l2jserver

ENTRYPOINT entrypoint