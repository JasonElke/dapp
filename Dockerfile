
FROM node:12.16.1 as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
ARG NODE_ENV
RUN  npm run build:$NODE_ENV

FROM nginx:1.16.0-alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

CMD ["nginx", "-g", "daemon off;"]
