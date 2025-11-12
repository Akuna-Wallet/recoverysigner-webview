FROM node:22-alpine AS build

RUN corepack enable

ADD . /app/src

WORKDIR /app/src

RUN yarn install --production
RUN yarn build

FROM nginx:1.17

COPY --from=build /app/src/docker/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/src/build/ /usr/share/nginx/html/

# Reset env-config.js
RUN rm -rf /usr/share/nginx/html/config/env-config.js
