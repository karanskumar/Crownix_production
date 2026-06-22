FROM node:20
WORKDIR /app

# pnpm uses hardlinks instead of copying files — far less memory than npm
RUN npm install -g pnpm@9 --prefer-online

COPY package*.json ./
RUN pnpm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
