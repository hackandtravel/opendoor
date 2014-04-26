FROM dockerfile/nodejs

RUN apt-get install -y gcc make build-essential

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app

ADD . /opt/app

# RUN cd /opt/app && npm install --production

EXPOSE 3000
EXPOSE 3001

CMD ["NODE_ENV=production", "node", "/opt/app/server.js"]
