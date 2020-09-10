FROM node
WORKDIR /

COPY ./src /src
COPY ./package*.json ./
COPY ./gulpfile.js ./tsconfig.json ./tslint.json ./

RUN npm install
RUN npm install -g gulp
RUN npm install gulp
RUN gulp

EXPOSE 4000
CMD ["npm", "start"]