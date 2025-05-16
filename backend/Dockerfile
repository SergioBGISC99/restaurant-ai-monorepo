FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY assets ./assets
COPY public ./public

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]