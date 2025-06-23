#stage 1
FROM gitlab.tre-ba.jus.br:5050/sistemas/docker-images/node18 as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

### STAGE 2: Run ###
FROM gitlab.tre-ba.jus.br:5050/sistemas/docker-images/nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/aplicacao-front /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
