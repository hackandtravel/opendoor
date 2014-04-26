define [
  'jquery'
  'config'
  'evil-things'
], ($, CONFIG) ->
  addCORSHeaders = (request) ->
    request.crossDomain = true
    request.xhrFields = withCredentials: true
    request

  return (request) ->
    unless request.url.startsWith(CONFIG.LOCATION)
      request.url = CONFIG.LOCATION + request.url

    request = addCORSHeaders(request)

    $.ajax(request)