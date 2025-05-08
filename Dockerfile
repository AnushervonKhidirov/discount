FROM node:22.15.0-alpine
COPY ./ /usr/app
WORKDIR /usr/app
RUN npm install