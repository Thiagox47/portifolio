# syntax=docker/dockerfile:1

FROM node:24.21.0-alpine3.24 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html styles.css script.js favicon.svg ./
COPY hero ./hero
COPY public ./public

RUN npm run build

FROM nginx:1.30.5-alpine3.24 AS production

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

ENTRYPOINT ["nginx", "-g", "daemon off;"]
