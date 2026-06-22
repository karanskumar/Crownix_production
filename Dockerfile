FROM node:20
WORKDIR /app

COPY package*.json ./

# Pass 1: production deps only — needed for Vite to bundle the frontend
RUN npm ci --omit=dev

# Pass 2: just the 5 build tools missing from prod deps
RUN npm install --no-save vite esbuild @vitejs/plugin-react tailwindcss autoprefixer

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
