FROM node:20
WORKDIR /app

COPY package*.json ./

RUN echo "NODE_ENV at build time: ${NODE_ENV:-<unset>}" && \
    env -u NODE_ENV npm install && \
    echo "--- vite check after install ---" && \
    ls node_modules/.bin/vite 2>/dev/null && echo "vite IS present" || echo "vite NOT present"

COPY . .
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
