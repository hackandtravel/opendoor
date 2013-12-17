class app.ContactView extends Backbone.View
  tagName: "a"
  className: "contact list-group-item media"
  template: Handlebars.compile($("#contact-template").html())

  events: 
    "click": "click"

  initialize: ->
    @listenTo(@model, 'change', @render)
    @render()

  render: ->
    @$el.html(@template(@toJSON()))

  click: ->
    app.entity = @model
    app.model.set("page", "transactions")

  toJSON: -> @model.toJSON()
