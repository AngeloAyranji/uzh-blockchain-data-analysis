FROM node:18-alpine as builder
ARG NODE_ENV
ARG BUILD_FLAG

WORKDIR /app

COPY . .

RUN echo "@community http://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories
RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm install -g nx
RUN yarn install
RUN apk del .gyp