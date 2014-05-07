define [
  'underscore'
], (_) ->
  class Door
    defaults: ->
      id: null
      deviceid: null
      deviceName: ''
      token: null
      masterToken: false
      name: ''
      buzztime: 5000
      number: -1
      expire: -1

    constructor: (args) ->
      _.extend this, @defaults(), args
      
    name: ->
      this.deviceName + '/' + this.name


