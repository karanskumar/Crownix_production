FROM node:20
WORKDIR /app

COPY package*.json ./

# Unset NODE_ENV so npm installs devDependencies (vite, esbuild, etc.)
RUN env -u NODE_ENV npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
