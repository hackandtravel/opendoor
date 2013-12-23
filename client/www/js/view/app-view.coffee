class app.AppView extends Backbone.View
  el: "#app"

  model: app.model

  template: Handlebars.compile($("#app-template").html())

  events:
    "click .opendoor-btn": "opendoorClicked"
    "click #login-btn": "loginClicked"
    "click #back-btn": "backClicked"
    "change .door-select": "selectedDoorChanged"
    "click #https": "setHttps"
    "click #http": "setHttp"
    "click #btn-new": "btnNewClicked"

  initialize: ->
    @listenTo @model, "change:page", @render
    @render()

  btnNewClicked: ->
    @model.set("page", "newDoor")

  backClicked: ->
    @model.set("page", "openDoor")

  render: ->
    @$el.html(@template(@model.toJSON()))

    switch @model.get("page")
      when "openDoor"
        @$(".new-door-page").hide()
        @$(".open-door-page").show()
        @$(".door-select").val(@model.get("doorUrl"))
      when "newDoor"
        @$(".new-door-page").show()
        @$(".open-door-page").hide()

  loginClicked: ->
    doorUrl = @model.get("prot") + @$("#door-url").val()
    console.log(doorUrl);
    passphrase = @$("#passphrase").val()
    deviceId = "TEST" #TODO

    @$(".form-group").removeClass("has-error")

    $.ajax
      url: "#{doorUrl}/login?passphrase=#{passphrase}&deviceId=#{deviceId}"
      crossDomain: true
      xhrFields: withCredentials: true
      statusCode:
        401: (resp) =>
          @$(".pass-form-group").addClass("has-error")
        404: (resp) =>
          @$(".door-form-group").addClass("has-error")
      success: (resp) =>
        if resp.hasOwnProperty("token")
          doorUrls = @model.get("doorUrls")
          doorUrls.push doorUrl

          localStorage["doorUrls"] = JSON.stringify(doorUrls)
          localStorage[doorUrl] = resp.token

          @model.set
            doorUrl: doorUrl
            page: "openDoor"
            disabled: ""

  opendoorClicked: (e) ->
    doorUrl = @model.get("doorUrl")
    token = localStorage[doorUrl]
    $.ajax 
      url: "#{doorUrl}/opendoor?token=#{token}"
      crossDomain: true
      xhrFields: withCredentials: true
      success: (resp) ->
        $t = $(e.currentTarget)
        $t.addClass("disabled")
        setTimeout -> 
          $t.removeClass("disabled")
        , 5000

  selectedDoorChanged: (e) ->
    doorUrl = $(e.currentTarget).val()
    @model.set "doorUrl", doorUrl
    @$(".opendoor-btn").removeClass("disabled")

  setHttps: -> 
    @$("#prot-text").text("https://")
    @model.set "prot", "https://"

  setHttp: -> 
    @$("#prot-text").text("http://")
    @model.set "prot", "http://"
