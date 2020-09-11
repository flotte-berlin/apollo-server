FROM node
WORKDIR /

COPY ./src /src
COPY ./package*.json ./
COPY ./gulpfile.js ./tsconfig.json ./
COPY ./ormconfig.json ./
RUN npm install
RUN npm install -g gulp
RUN npm install gulp
RUN gulp

EXPOSE 4000
EXPOSE 5432
CMD ["npm", "start"]