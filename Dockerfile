#FROM node:16.13.1-alpine3.15
FROM node:18-alpine
WORKDIR '/app'
#RUN apk add --update g++ make python3 py3-pip 
RUN apk add --update imagemagick ghostscript
# Fix ImageMagick policy to allow PDF reading
RUN sed -i 's/<policy domain="coder" rights="none" pattern="PDF" \/>/<policy domain="coder" rights="read|write" pattern="PDF" \/>/' /etc/ImageMagick-7/policy.xml
# RUN npm install -g pnpm
RUN if [ "$(uname -m)" = "armv7l" ] || [ "$(uname -m)" = "armv6l" || [ "$(uname -m)" = "ppc64le" ]; then \
      echo 'nothing'; \
    else \
      npm install -g pnpm; \
    fi
COPY package*.json ./
COPY pnpm-*.yaml ./
# RUN pnpm fetch --prod
ADD . ./
# RUN pnpm install -r --offline --prod
# RUN pnpm install --no-frozen-lockfile
RUN if [ "$(uname -m)" = "armv7l" ] || [ "$(uname -m)" = "armv6l" || [ "$(uname -m)" = "ppc64le" ]; then \
      npm install --no-package-lock; \
    else \
      pnpm install --no-frozen-lockfile; \
    fi
#RUN npm install
#COPY . .
CMD ["node","bot.js"]
