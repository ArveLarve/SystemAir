FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --quiet

COPY . .

EXPOSE 3000

CMD [ "node", "bin/api.js" ]