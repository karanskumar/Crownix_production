FROM node:20
WORKDIR /app

# pnpm uses hardlinks instead of copying files — far less memory than npm
RUN npm install -g pnpm@9 --prefer-online

COPY package*.json ./
RUN pnpm install

COPY . .

# Vite reads VITE_* env vars at build time. Railway exposes service
# variables to the build via ARG; re-export as ENV so Vite picks them up.
ARG VITE_RECAPTCHA_SITE_KEY
ENV VITE_RECAPTCHA_SITE_KEY=$VITE_RECAPTCHA_SITE_KEY
RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/index.js"]
