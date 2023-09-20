FROM node:16.17.1

WORKDIR /schedule-back

COPY package.json .
COPY package-lock.json .
RUN npm ci 

COPY . .

ENV NODE_PATH=./build

RUN npm run build