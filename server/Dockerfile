FROM danscan/node
ADD . /src
RUN cd src; npm install --production
EXPOSE 3000
EXPOSE 3001
CMD ["node", "src/server.js"]
