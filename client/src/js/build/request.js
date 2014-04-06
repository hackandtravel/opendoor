(function() {
  define(['jquery', 'config'], function($, CONFIG) {
    var addCORSHeaders, request;
    addCORSHeaders = function(request) {
      request.crossDomain = true;
      request.xhrFields = {
        withCredentials: true
      };
      return request;
    };
    return request = (function(_this) {
      return function(request) {
        request = addCORSHeaders(request);
        request.url = CONFIG.LOCATION + request.url;
        return $.ajax(request);
      };
    })(this);
  });

}).call(this);
