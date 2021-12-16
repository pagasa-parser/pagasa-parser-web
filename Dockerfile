FROM node:16

ENV NODE_ENV=production

RUN apt-get update
RUN apt-get -y install default-jre

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

# Backend must go first
WORKDIR /usr/src/app/backend
COPY backend/ .
RUN npm run build

WORKDIR /usr/src/app/frontend
COPY frontend/ .
RUN npm run build

# ====================================
# Start
# ====================================

WORKDIR /usr/src/app/backend

EXPOSE 12464

CMD [ "node", "build/PagasaParserWeb.js" ]
