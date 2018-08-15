FROM node:8.11.3

WORKDIR /opt/service
COPY config.js package.json atlaskit-atlaskid.sd.yml /opt/service/

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update && apt-get dist-upgrade -y

RUN yarn install --pure-lockfile

EXPOSE 8080

CMD yarn start
