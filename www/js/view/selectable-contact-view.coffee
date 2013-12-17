class app.SelectableContactView extends app.ContactView
  initialize: ->
    super
    @model.set("selected", app.selected.get(@model)?)

  render: ->
    super
    selected = @model.get("selected") or false
    if selected then @$el.addClass("active") else @$el.removeClass("active")

  click: ->
    selected = @model.get("selected") or false
    @model.set("selected", !selected)

    if selected is false
      app.selected.add(@model)
    else 
      app.selected.remove(@model)

    app.model.set("numSelected", app.selected.length)
