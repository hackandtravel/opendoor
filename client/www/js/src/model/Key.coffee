define [
  'underscore'
], (_) ->
  class Key
    defaults: ->
      doors: []
      expire: -1
      key: null
      limit: -1
      name: null

    constructor: (args) ->
      _.extend this, @defaults(), args

