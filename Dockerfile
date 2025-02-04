FROM node:22-bookworm-slim AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prod

FROM debian:bullseye

RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    python3 \
    python3-pip 

RUN pip install scapy

RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g npm@latest

WORKDIR /app

COPY --from=builder /app/dist ./app
COPY --from=deps /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "./app/bundle.js"]
