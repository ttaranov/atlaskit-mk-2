FROM node:8.4.0

WORKDIR /opt/service
COPY config.js package.json atlaskit-atlaskid.sd.yml /opt/service/

RUN yarn install --pure-lockfile

EXPOSE 8080

CMD yarn start
