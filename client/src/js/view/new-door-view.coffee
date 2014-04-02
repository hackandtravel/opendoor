class app.NewDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#new-door-template").html())

  events:
    "click #login-btn": "loginClicked"
    "click #back-btn": "backClicked"

  initialize: ->
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))

  loginClicked: ->
    deviceId = @$("#door-url").val()
    key = @$("#passphrase").val()

    @$("#new-door-brand").html('<div class="loading spin"></div>')
    @$(".form-group").removeClass("has-error")

    $.ajax
      url: app.location + "/login?deviceid=#{deviceId}&key=#{key}"
      crossDomain: true
      xhrFields: withCredentials: true
      statusCode:
        401: () =>
          @$(".pass-form-group").addClass("has-error")
          @$(".door-form-group").addClass("has-error")
      error: (err) =>
        @$(".navbar-brand").text(err.status)
      success: (resp) =>
        @$("#new-door-brand").text("Add a door")
        @$("#door-url").val("")
        @$("#passphrase").val("")
        
        json = localStorage.getItem("deviceIds")
        deviceIds = if json? then JSON.parse(json) else []
          
        if not _.contains(deviceIds, deviceId)
          deviceIds.push deviceId
          localStorage.setItem('deviceIds', JSON.stringify(deviceIds))
          
        localStorage.setItem(deviceId, JSON.stringify(resp))
        
        @model.set
          doorUrl: deviceId
          page: "openDoor"
          disabled: ""

  backClicked: ->
    @model.set("page", "openDoor")

