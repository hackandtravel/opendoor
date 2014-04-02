class app.OpenDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#open-door-template").html())

  events:
    "click #btn-open-door": "opendoorClicked"
    "change #select-door": "selectedDoorChanged"
    "click #btn-new": "btnNewClicked"

  initialize: ->
    # @listenTo(@model, 'change', @render)
    @render()

  render: ->
    console.log('render open door view')
    @$el.html(@template(@model.toJSON()))
    doorNumber = @model.get("doorUrl")?.number
    @$("#select-door").val(doorNumber)

  opendoorClicked: (e) ->
    @$("#open-door-brand").html('<div class="loading spin"></div>')

    doorNumber = @model.get("doorUrl")
    deviceId = @model.get("deviceId")
    device = JSON.parse(localStorage.getItem(deviceId))
    token = device.token
    
    $.ajax 
      url: "#{app.location}/openDoor?deviceid=#{deviceId}&doorNumber=#{doorNumber}&token=#{token}"
      crossDomain: true
      xhrFields: withCredentials: true
      success: (resp) =>
        @$("#open-door-brand").text("OpenDoor")
        
        $t = $(e.currentTarget)
        $t.addClass("disabled")
        setTimeout -> 
          $t.removeClass("disabled")
        , 5000

        if navigator and navigator.notification
          navigator.notification.vibrate(5000)

      error: (err) =>
        @$("#open-door-brand").text(err.status)

  selectedDoorChanged: (e) ->
    node = $(e.currentTarget)
    doorNumber = node.val()
    option = node.find("option[value=#{doorNumber}]")
    deviceId = option.data('deviceid')
    
    @model.set "doorUrl", doorNumber
    @model.set "deviceId", deviceId
    
    @$("#btn-open-door").removeClass("disabled")

  btnNewClicked: ->
    @model.set 
      "page": "newDoor"

