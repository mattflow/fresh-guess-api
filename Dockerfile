ARG puppeteer_version=21

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

ENV PORT 80
EXPOSE 80

CMD ["npm", "run", "start:prod"]