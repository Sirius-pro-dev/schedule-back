FROM node:18

RUN mkdir -p /usr/src/app/dist/
WORKDIR /usr/src/app/

COPY . .
RUN npm ci --omit=dev

EXPOSE 3007

CMD ["npm", "run", "up:prod"]
