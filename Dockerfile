# ====================================================
#                     BUILD IMAGE
# ====================================================

FROM node:16-alpine AS BUILD_IMAGE

# Disable npm update message
RUN npm config set update-notifier false

# ====================================
# Install dependencies
# ====================================
WORKDIR /build

COPY package*.json .
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
RUN npm -d ci && cd /build/frontend && npm -d ci ../backend

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
RUN mkdir -p backend/static/app/js/ && mv frontend/build/* backend/static/app/js/

# Cleanup
RUN rm -rf /build/src

# ====================================================
#                       APP IMAGE
# ====================================================

FROM node:16-alpine
ENV NODE_ENV=production

# Install headless JRE, disable npm update notice.
RUN apk update \
    && apk add openjdk11-jre-headless \
    && npm config set update-notifier false

# ====================================
# Copy built files
# ====================================

WORKDIR /app

# Install dependencies
COPY --from=BUILD_IMAGE /build/backend/package*.json /app/
RUN npm ci

# Move built JS to static app
COPY --from=BUILD_IMAGE /build/backend /app

# ====================================
# Start
# ====================================

ENV PORT 80
EXPOSE 80

CMD [ "node", "build/PagasaParserWeb.js" ]
