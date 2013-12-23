(function() {
  var app, express;

  express = require('express');

  app = express();

  app.use(express["static"]('www'));

  app.use(express.bodyParser());

  app.listen(3000);

}).call(this);
