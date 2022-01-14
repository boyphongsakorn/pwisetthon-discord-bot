FROM node:16.13.1-alpine3.15
WORKDIR '/app'
COPY package*.json ./
#RUN apk add --update g++ make python3 py3-pip 
RUN apk add --update imagemagick
RUN npm install
COPY . .
CMD ["node","bot.js"]
