class app.NewDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#new-door-template").html())

  events:
    "click #login-btn": "loginClicked"
    "click #back-btn": "backClicked"
    "click #https": "setHttps"
    "click #http": "setHttp"

  initialize: ->
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))
    if @model.get("prot") is "https://" then @setHttps() else @setHttp()

  loginClicked: ->
    doorUrl = @model.get("prot") + @$("#door-url").val()
    passphrase = @$("#passphrase").val()

    if window.device
      deviceId = window.device.uuid
    else 
      if not localStorage.getItem("browserId")
        s4 = -> Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        guid = -> s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
        localStorage.setItem("browserId", guid())
      deviceId = localStorage.getItem("browserId")

    @$("#new-door-brand").html('<div class="loading spin"></div>')
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
      error: (err) =>
        @$(".navbar-brand").text(err.status)
      success: (resp) =>
        if not resp.hasOwnProperty("token")
          @$("#new-door-brand").text("500")
        else
          @$("#new-door-brand").text("Add a door")
          @$("#door-url").val("")
          @$("#passphrase").val("")

          doorUrls = @model.get("doorUrls")

          if not _.contains(doorUrls, doorUrl)
            doorUrls.push doorUrl
            localStorage.setItem("doorUrls", JSON.stringify(doorUrls))
            localStorage.setItem(doorUrl, resp.token)

          @setHttps()
          @model.set
            doorUrl: doorUrl
            page: "openDoor"
            disabled: ""
            prot: "https://"

  backClicked: ->
    @model.set("page", "openDoor")

  setHttps: -> 
    @$("#prot-text").text("https://").parent().removeClass("btn-danger")
    @model.set "prot", "https://"

  setHttp: -> 
    @$("#prot-text").text("http://").parent().addClass("btn-danger")
    @model.set "prot", "http://"
