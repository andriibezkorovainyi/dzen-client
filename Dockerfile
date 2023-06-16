FROM node:14 as build

WORKDIR /dzen-client

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g serve

RUN npm run build

CMD ["serve", "-s", "dist", "-l", "4173"]