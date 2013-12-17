class app.AdjustableContactView extends app.ContactView
  tagName: "span"
  template: Handlebars.compile($("#adjustable-contact-template").html())

  events:
    "change .balance-input": "lock"

  initialize: ->
    @listenTo @model, "change:locked", @renderLock
    @model.set
      share: app.model.get("balance-input") / app.selected.length
      locked: false
    super

  click: -> undefined

  renderLock: -> @$el.toggleClass "locked", @model.get("locked")

  lock: (e) -> 
    @model.set
      locked: true
      share: parseFloat($(e.currentTarget).val())

    balance = app.model.get("balance-input")
    locked = app.selected.groupBy (contact) -> contact.get("locked")

    remaining = _.reduce locked.true, (sum, contact) -> 
      sum - contact.get("share")
    , 
      balance

    if locked.false?
      _.each locked.false, (contact) -> contact.set("share", remaining / locked.false.length)

    sum = app.selected.reduce (sum, contact) -> 
      sum + contact.get("share")
    , 
      0

    app.model.set("balance-input", sum)

  toJSON: ->
    res = super
    res.lockedIcon = if res.locked then "glyphicon-lock" else ""
    res
