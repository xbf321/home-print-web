ARG MAINTAINER
FROM node:16
MAINTAINER $MAINTAINER

WORKDIR /root/app

COPY . /root/app/

RUN npm install pm2 -g --registry=https://registry.npmmirror.com
RUN npm install --registry=https://registry.npmmirror.com
RUN npm run build


ENV PORT=7020

EXPOSE 7020

# CMD [ "pm2-runtime", "start", "npm", "--", "start" ]
CMD [ "npm", "start" ]