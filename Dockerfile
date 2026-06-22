FROM node:20
WORKDIR /app

# Show what npm config says about omit/production before we touch anything
RUN npm config get omit; npm config get production; echo "NODE_ENV=[${NODE_ENV}]"

COPY package*.json ./

# Unset every possible source of "production mode" in npm, then install
RUN env \
    -u NODE_ENV \
    -u NPM_CONFIG_PRODUCTION \
    -u NPM_CONFIG_OMIT \
    -u npm_config_production \
    -u npm_config_omit \
    npm install --include=dev

RUN ls node_modules/.bin/vite && echo "vite FOUND" || echo "vite MISSING"

COPY . .

RUN ls node_modules/.bin/vite && echo "vite still FOUND after COPY" || echo "vite GONE after COPY"

RUN npm run build

ENV NODE_ENV=production
EXPOSE 5000

CMD ["sh", "-c", "npm run db:push && node dist/index.js"]
