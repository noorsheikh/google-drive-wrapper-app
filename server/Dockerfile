FROM node:20-alpine

WORKDIR /app

RUN npm i -g nodemon

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start" ]