FROM node:16-slim as build
WORKDIR /home/app

COPY ./package*.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:16-slim
WORKDIR /home/app

COPY ./package*.json ./
RUN npm install --only=production

COPY --from=build /home/app/build ./build

ENV NODE_ENV=production

CMD ["node", "build/index.js"]
