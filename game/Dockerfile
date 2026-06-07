FROM node:22-alpine AS build-stage

RUN apk add --no-cache git \
  && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
  && git config --global url."https://github.com/".insteadOf "git@github.com:"

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm i

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine AS production

RUN apk add --no-cache git \
  && git config --global url."https://github.com/".insteadOf "ssh://git@github.com/" \
  && git config --global url."https://github.com/".insteadOf "git@github.com:"

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm i --omit=dev

COPY --from=build-stage /app/build ./build

ENV NODE_ENV=production
ENV PORT=2567

EXPOSE 2567

CMD ["node", "build/index.js"]
