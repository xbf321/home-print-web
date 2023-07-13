ARG MAINTAINER
FROM node:16
MAINTAINER $MAINTAINER

WORKDIR /root/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 7001

CMD npm run start