FROM node:20

WORKDIR /app

COPY . .

RUN npm run build