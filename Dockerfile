FROM node:16.13.1-alpine3.15
WORKDIR '/app'
COPY package*.json ./
RUN apk add --update python3 py3-pip g++ make
RUN npm install
COPY . .
CMD ["node","bot.js"]
