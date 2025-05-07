FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./
COPY apps/backend/webpack.config.js ./apps/backend/
COPY apps/frontend/vite.config.ts ./apps/frontend/

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE ${PORT}

CMD ["node", "dist/apps/backend/main.js"]