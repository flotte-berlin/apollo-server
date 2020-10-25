FROM node:14.14.0-alpine3.10 AS builder
RUN npm --version
WORKDIR /

COPY ./src /src
COPY ./package*.json ./
COPY ./gulpfile.js ./
COPY ./tsconfig.json ./
COPY ./.eslintrc.json ./
RUN npm install

RUN npm install gulp
RUN npx eslint --config .eslintrc.json
RUN npx gulp


FROM node:14.14.0-alpine3.10
COPY --from=builder ./dist ./dist
COPY --from=builder ./package*.json ./
RUN npm install --production
EXPOSE 4000
CMD ["npm", "start"]
