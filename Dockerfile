FROM node:16-alpine

RUN apk update \
    && apk add openjdk11-jre-headless

# Disable npm update message
RUN npm config set update-notifier false

# ====================================
# Install dependencies
# ====================================
WORKDIR /usr/src/app

COPY package*.json .
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
RUN npm -d ci
WORKDIR /usr/src/app/frontend
RUN npm -d ci ../backend
WORKDIR /usr/src/app

# ====================================
# Copy and build
# ====================================

ENV NODE_ENV=production
ENV HEADLESS=true

# Backend must go first
COPY backend backend
RUN npm run --workspace=backend build

COPY frontend frontend
RUN npm run --workspace=frontend build

# ====================================
# Cleanup
# ====================================

# Move built JS to static app
RUN mkdir -p backend/static/app/js/
RUN mv frontend/build/* backend/static/app/js/
RUN npm -d prune --production --workspace=backend
RUN rm -rf backend/src

# Delete frontend source - all compiled into static folder.
RUN rm -rf frontend

# ====================================
# Start
# ====================================

ENV PORT 80
EXPOSE 80

WORKDIR /usr/src/app/backend
CMD [ "node", "build/PagasaParserWeb.js" ]
