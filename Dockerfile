FROM node:20-slim
WORKDIR /app

COPY package*.json ./

# env -u NODE_ENV unsets it completely so npm installs devDependencies regardless
# of anything Railway injects at build time
RUN env -u NODE_ENV npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
