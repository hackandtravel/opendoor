class app.TransactionView extends Backbone.View
  tagName: "span"
  className: "transaction list-group-item media"
  template: Handlebars.compile($("#transaction-template").html())

  events: 
    "click .accept-btn": "accept"
    "click .decline-btn": "decline"

  initialize: ->
    @listenTo(@model, 'change', @render)
    @render()
    @$el.addClass(@model.get("status"))

  render: ->
    @$el.html(@template(@toJSON()))

  accept: ->
    @model.save status: "ok",
      wait: true
    @model.set("status", "inflight")

  decline: ->
    @model.save status: "rejected",
      wait: true
    @model.set("status", "inflight")

    balance = app.entity.get("balance")
    app.entity.set("balance", balance - @model.get("balance"))

  toJSON: ->
    res = @model.toJSON() 
    res.isPending = res.status is "pending" and res.to is "XXXme"
    if res.status is "generated"
      res.reason = "Yay, we discoverd a circle between you, #{res.name1}, #{res.name2} and #{res.numIntermediates} other poeple."
    res

