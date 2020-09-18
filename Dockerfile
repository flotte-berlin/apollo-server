FROM node AS builder
WORKDIR /

COPY ./src /src
COPY ./package*.json ./
COPY ./gulpfile.js ./
COPY ./tsconfig.json ./
RUN npm install
RUN npm install -g gulp
RUN npm install gulp

RUN gulp

FROM node
COPY --from=builder ./dist ./dist
COPY --from=builder ./package*.json ./
RUN npm install --production
EXPOSE 4000
CMD ["npm", "start"]
