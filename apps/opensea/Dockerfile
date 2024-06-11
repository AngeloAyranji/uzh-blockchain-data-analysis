# Stage 1: Install dependencies in a separate layer to leverage Docker cache
FROM node:lts-alpine as deps
WORKDIR /usr/src/app
COPY dist/apps/opensea/package.json dist/apps/opensea/yarn.lock ./
RUN apk add --no-cache --virtual .build-deps python3 make g++ && \
    echo "@community http://dl-cdn.alpinelinux.org/alpine/v3.18/community" >> /etc/apk/repositories && \
    yarn install --production && \
    apk del .build-deps

# Stage 2: Build the application
# Note: Assuming main.js doesn't require a build process. If it does, you would need to copy source files and build here.
FROM node:lts-alpine as build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY dist/apps/opensea/ ./

# Stage 3: Production image, copy all the files and run the app
FROM node:lts-alpine as runner
RUN apk add --no-cache dumb-init && \
    addgroup -S appgroup && adduser -S appuser -G appgroup
ENV NODE_ENV production
ENV PORT 4000

WORKDIR /usr/src/app
# Copy only necessary runtime files
COPY --from=build /usr/src/app/ ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# Use non-root user for better security
USER appuser

EXPOSE 4001
CMD [ "npm", "run"]