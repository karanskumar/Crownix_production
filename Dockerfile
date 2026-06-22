FROM node:20-slim
WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=development
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
