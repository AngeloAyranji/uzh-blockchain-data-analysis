FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm install -g nx
RUN apk del .gyp

COPY . .

RUN yarn install

RUN nx build dashboard --configuration=production