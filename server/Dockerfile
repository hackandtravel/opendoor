# DOCKER-VERSION 0.9.0
FROM danscan/node
# RUN mkdir src; cd src
# RUN npm install socket.io
EXPOSE 3000
ADD . /src
RUN npm install
CMD ["node", "src/raspberry.js"]
