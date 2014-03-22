# DOCKER-VERSION 0.9.0
FROM danscan/node
RUN mkdir src; cd src
RUN npm install socket.io
EXPOSE 3000

# Development:
# CMD ["nodemon", "src/server.js"]

# Production:
ADD . /src
CMD ["node", "src/server.js"]

