class app.AppView extends Backbone.View
  el: "#app"

  model: app.model

  template: Handlebars.compile($("#app-template").html())

  initialize: ->
    @listenTo @model, "change:page", @changePage
    @render()

  render: ->
    @$el.html(@template(@model.toJSON()))
    @newDoorView = new app.NewDoorView model: @model, el: "#page-new-door"
    @openDoorView = new app.OpenDoorView model: @model, el: "#page-open-door"
    @changePage()

  changePage: ->
    switch @model.get("page")
      when "newDoor"
        @newDoorView.render()
        @$("#page-new-door").removeClass("page-right").addClass("page-middle")
        @$("#page-open-door").removeClass("page-middle").addClass("page-left")
      when "openDoor"
        @openDoorView.render()
        @$("#page-new-door").removeClass("page-middle").addClass("page-right")
        @$("#page-open-door").removeClass("page-left").addClass("page-middle")
