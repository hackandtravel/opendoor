class app.OpenDoorView extends Backbone.View
  model: app.model

  template: Handlebars.compile($("#open-door-template").html())

  events:
    "click .opendoor-btn": "opendoorClicked"
    "change .door-select": "selectedDoorChanged"
    "click #btn-new": "btnNewClicked"

  initialize: ->
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))
    @$(".door-select").val(@model.get("doorUrl"))

  opendoorClicked: (e) ->
    doorUrl = @model.get("doorUrl")
    token = localStorage[doorUrl]
    $.ajax 
      url: "#{doorUrl}/opendoor?token=#{token}"
      crossDomain: true
      xhrFields: withCredentials: true
      success: (resp) =>
        @$(".navbar-brand").text("OpenDoor")
        $t = $(e.currentTarget)
        $t.addClass("disabled")
        setTimeout -> 
          $t.removeClass("disabled")
        , 5000
      error: (err) =>
        @$(".navbar-brand").text(err.status)

  selectedDoorChanged: (e) ->
    doorUrl = $(e.currentTarget).val()
    @model.set "doorUrl", doorUrl
    @$(".opendoor-btn").removeClass("disabled")

  btnNewClicked: ->
    @model.set("page", "newDoor")

