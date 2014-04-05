define [
  'underscore'
], (_) ->
  class Door
    defaults: ->
      buzztime: 5000
      name: null
      number: 1
      expire: 0

    constructor: (args) ->
      _.extend this, @defaults(), args


