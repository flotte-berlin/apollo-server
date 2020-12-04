# API-server
Apollo server written in typescript that handles business logic.

[![Build Status](https://travis-ci.com/fLotte-meets-HWR-DB/apollo-server.svg?token=YfRmpHAXqyUafCgSEexw&branch=main)](https://travis-ci.com/fLotte-meets-HWR-DB/apollo-server)

## Assumptions
The [flotte-user-management server](https://github.com/fLotte-meets-HWR-DB/flotte-user-management) and postgres are running. Set the [environment variables](#Environment-Variables) accordingly.
## Usage
### Docker
You can build and run a docker image with
```bash
docker build -t <image name> .
docker run --rm -p 4000:4000 <image name> -e ...
```
Don't forget to pass all the [environment variables](#Environment-Variables) with the -e option.
### Compile and Run
Install gulp if not installed
```bash
npm -g gulp
```
```bash
npm install
gulp
npm start
```
You can set the [environment variables](#Environment-Variables) in a _.env_ file.
### For Development
Install node\_modules and gulp
```bash
npm -g gulp
npm install
```
Start gulp in watch mode to recompile the type script
```bash
gulp watchTs
```
This will watch *.ts files in _./src_ and recompile to _./dist_. You will have to restart the server yourself.

## Environment Variables
The following environment variables can be used to configure the server:
```bash
RPC_HOST=host:port
NODE_ENV=develop/production
POSTGRES_CONNECTION_URL=postgres://username:password@host:port/database_name
```
- __RPC_HOST__ is used for the connection with the [flotte-user-management server](https://github.com/fLotte-meets-HWR-DB/flotte-user-management).
- __NODE_ENV__ will not check authentication if set to development
- __POSTGRES_CONNECTION_URL__ for connection with the postgres database

If the API server cannot connect to the [flotte-user-management server](https://github.com/fLotte-meets-HWR-DB/flotte-user-management) or the postgres data base. It will try to reconnect in an endless loop.
