# API-server
Apollo server written in typescript that handles business logic.

[![Build Status](https://travis-ci.com/flotte-goes-smart/apollo-server.svg?token=YfRmpHAXqyUafCgSEexw&branch=main)](https://travis-ci.com/flotte-goes-smart/apollo-server)

## Assumptions
Userserver and postgres are running e.g. with Julius' Docker Compose.
## Usage
### Docker
```bash
docker build -t <image name> .
docker run --rm -p 4000:4000 <image name>
```
The Dockerfile is pretty stupid and could produce a smaller image, e.g. with multistage build.
### Compile and run
Install gulp if not installed
```bash
npm -g gulp
```
```bash
npm install
gulp
npm start
```
### For Development
Install node_modules and gulp
```bash
npm -g gulp
npm install
```
And start gulp in watch mode
```bash
gulp watch
```
This will watch *.ts files in _./src_ and recompile to _./dist_ and finally restart the server.

## Environment Variables
The following environment variables can be used to configure the server:
```bash
RPC_HOST=host:port
NODE_ENV=development/porduction
POSTGRES_CONNECTION_URL=postgres://username:password@host:port/database_name
```
- __RPC_HOST__ is used for the connection with the userserver.
- __NODE_ENV__ will not check authentication if set to development
- __POSTGRES_CONNECTION_URL__ for connection with the postgres database
