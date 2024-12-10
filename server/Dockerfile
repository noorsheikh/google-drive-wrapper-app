FROM node:20-alpine

WORKDIR /app

# Create directory with right permissions to hold temp uploaded files.
RUN mkdir uploads && chmod -R 755 uploads/

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start" ]