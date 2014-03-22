class app.OpenDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#open-door-template").html())

  events:
    "click #btn-open-door": "opendoorClicked"
    "change #select-door": "selectedDoorChanged"
    "click #btn-new": "btnNewClicked"

  initialize: ->
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))
    @$("#select-door").val(@model.get("doorUrl"))

  opendoorClicked: (e) ->
    @$("#open-door-brand").html('<div class="loading spin"></div>')

    doorUrl = @model.get("doorUrl")
    token = localStorage.getItem(doorUrl)
    $.ajax 
      url: "#{doorUrl}/opendoor?token=#{token}"
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
    doorUrl = $(e.currentTarget).val()
    @model.set "doorUrl", doorUrl
    @$("#btn-open-door").removeClass("disabled")

  btnNewClicked: ->
    @model.set 
      "page": "newDoor"
      "prot": "https://"

