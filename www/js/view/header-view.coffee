class app.HeaderView extends Backbone.View
  tagName: "div"
  className: "navbar-header"
  template1: Handlebars.compile($("#header-contacts-template").html())
  template2: Handlebars.compile($("#header-transactions-template").html())
  template3: Handlebars.compile($("#header-addressbook-template").html())
  template4: Handlebars.compile($("#header-adjust-template").html())

  initialize: ->
    @listenTo(@model, 'change:page', @render)
    @listenTo(@model, 'change:numSelected', @render)
    @listenTo(@model, 'change:promise-select', @render)
    @listenTo(@model, 'change:balance-input', @render)
    @listenTo(@model, 'change:currency-select', @render)
    @listenTo(@model, 'change:showSearchField', @renderSearchField)
    @render()

  events:
    "click .new-btn": "newButtonClicked"
    "click .search-btn": "searchButtonClicked"
    "click .back-btn": "back"
    "click .close-search": "closeSearch"
    "keyup .search-input": "filter"

  render: ->
    @$el.html(@template1(@model.toJSON()))

    page = @model.get("page") 
    switch page
      when "contacts"
        @$el.html(@template1(@model.toJSON()))
      when "transactions"
        @$el.html(@template2(app.entity.toJSON()))
        @listenTo app.entity, "change:balance", @render
      when "addressbook"
        @$el.html(@template3(@toJSON()))
      when "adjust"
        @$el.html(@template4(@toJSON()))

  filter: ->
    query = @$(".search-input").val()
    @model.set("query", query)

  # TODO: Better solution
  renderSearchField: -> 
    @render()

  back: -> 
    page = @model.get("page")
    showSearchField = @model.get("showSearchField")

    if page is "addressbook" and showSearchField is true
      @closeSearch()
    else if page is "adjust"
      @model.set("page", "addressbook")
    else
      @model.set("page", "contacts")
      app.selected.reset()

    if page is "transactions" or page is "addressbook"
      @model.resetInput()

  closeSearch: ->
    @model.set("showSearchField", false)
    @model.set("query", "")

  newButtonClicked: ->
    @model.set("page", "addressbook")

  searchButtonClicked: ->
    @model.set("showSearchField", true)
    @$(".search-input").focus()

  toJSON: ->
    res = @model.toJSON()
    res.numSelected = app.selected.length
    res.adjustBalance = parseFloat(res["promise-select"] + res["balance-input"])
    res.adjustCurrency = @model.get("currency-select")
    res
