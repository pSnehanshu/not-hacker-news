FROM node:16-slim

WORKDIR /home/app

COPY ./package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV=production

CMD ["npm", "start"]
