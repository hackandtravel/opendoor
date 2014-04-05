(function() {
  define(['jquery', 'config', 'evil-things'], function($, CONFIG) {
    var addCORSHeaders;
    addCORSHeaders = function(request) {
      request.crossDomain = true;
      request.xhrFields = {
        withCredentials: true
      };
      return request;
    };
    return function(request) {
      if (!request.url.startsWith(CONFIG.LOCATION)) {
        request.url = CONFIG.LOCATION + request.url;
      }
      request = addCORSHeaders(request);
      return $.ajax(request);
    };
  });

}).call(this);
