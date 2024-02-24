FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY vite.config.js ./

RUN npm install

COPY . .

ENV PORT=3000

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "preview" ]