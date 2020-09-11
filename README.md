# API-server
Apollo server written in typescript that handles business logic.

## Usage
### Configure Postgres
Install postgresql and configure it, so the Database is accessible from remote hosts (only necessary for docker container [Here](https://wiki.archlinux.org/index.php/PostgreSQL))

See postgres client config in __ormconfig.json__
### Docker
```bash
docker build -t <image name> .
docker run --rm --network="host" <image name>
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
