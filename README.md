# API-server
Apollo server written in typescript that handles business logic.

## Usage
### Docker
```bash
docker build -t <image name> .
docker run --rm -p 4000:4000 <image name>
```
The Dockerfile is pretty stupid and could produce a smaller image, e.g. with multistage build.
### NPM and gulp
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
```bash
gulp watch
```
to compile in watch mode. And in another terminal run
```bash
npm start
```
The later command uses nodemon. I am sure you can so this with gulp as well.
