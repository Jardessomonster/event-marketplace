FROM node:16-alpine3.14
WORKDIR /usr/src/
COPY package.json .
RUN yarn
COPY . .
EXPOSE 3333
RUN yarn build
RUN cp .env build/.env
CMD yarn start