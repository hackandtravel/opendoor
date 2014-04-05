define [
  'underscore'
], (_) ->
  class Door
    defaults: ->
      deviceid: null
      buzztime: 5000
      name: null
      number: 1
      expire: 0

    constructor: (args) ->
      _.extend this, @defaults(), args


