FROM node:8
EXPOSE 3000
ADD . /home/app
WORKDIR /home/app
RUN npm install
CMD [ "npm", "run", "watch" ]
