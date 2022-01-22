FROM node:16-alpine

RUN apk update \
    && apk add openjdk11-jre-headless

# Disable npm update message
RUN npm config set update-notifier false

# ====================================
# Install dependencies
# ====================================
WORKDIR /usr/src/app/backend

COPY backend/package*.json ./
RUN npm ci

WORKDIR /usr/src/app/frontend

COPY frontend/package*.json ./
RUN npm ci
RUN npm install ../backend

# ====================================
# Copy and build
# ====================================

ENV NODE_ENV=production
ENV HEADLESS=true

# Backend must go first
WORKDIR /usr/src/app/backend
COPY backend/ .
RUN npm run build

WORKDIR /usr/src/app/frontend
COPY frontend/ .
RUN npm run build

# ====================================
# Cleanup
# ====================================

WORKDIR /usr/src/app/backend
RUN npm prune --production

WORKDIR /usr/src/app/frontend
RUN npm prune --production

# ====================================
# Start
# ====================================

WORKDIR /usr/src/app/backend

# Symlink static to frontend build path
RUN ln -sf ../../../frontend/build static/app/js

ENV PORT 80
EXPOSE 80

CMD [ "node", "build/PagasaParserWeb.js" ]
