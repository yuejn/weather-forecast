FROM node:8
EXPOSE 8080
ADD . /home/app
WORKDIR /home/app
RUN npm install
CMD [ "npm", "start" ]
