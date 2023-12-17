ARG puppeteer_version=21
ARG port=80

FROM --platform=linux/amd64 ghcr.io/puppeteer/puppeteer:${puppeteer_version} as builder

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

FROM --platform=linux/amd64 ghcr.io/puppeteer/puppeteer:${puppeteer_version} as runner

ENV NODE_ENV production

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY --from=builder /app/dist ./dist

ENV PORT ${port}
EXPOSE ${port}

CMD ["npm", "run", "start:prod"]