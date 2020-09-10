# API-server
Apollo server written in typescript that handles business logic.

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
