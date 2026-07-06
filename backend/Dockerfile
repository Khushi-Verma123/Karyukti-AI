FROM node:20-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage: lean image
FROM node:20-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Copy the database file so data persists
COPY database.json ./database.json

EXPOSE 3001

CMD ["node", "dist/index.js"]
