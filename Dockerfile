#FROM node:16.13.1-alpine3.15
FROM node:lts-alpine
WORKDIR '/app'
#RUN apk add --update g++ make python3 py3-pip 
RUN apk add --update imagemagick
RUN npm install -g pnpm
COPY package*.json ./
COPY pnpm-*.yaml ./
# RUN pnpm fetch --prod
ADD . ./
# RUN pnpm install -r --offline --prod
RUN pnpm install --no-frozen-lockfile
#RUN npm install
#COPY . .
CMD ["node","bot.js"]
