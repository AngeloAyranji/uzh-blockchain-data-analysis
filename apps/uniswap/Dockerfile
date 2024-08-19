FROM node:18-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN apk add --no-cache --virtual .gyp python3 make g++
RUN npm install -g nx prisma
RUN apk del .gyp

COPY . .

RUN yarn install

RUN prisma generate --schema=apps/uniswap/prisma/schema.prisma
RUN prisma generate --schema=libs/collection-db/prisma/schema.prisma

RUN nx build uniswap --configuration=production