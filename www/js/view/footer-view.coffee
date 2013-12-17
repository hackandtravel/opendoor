class app.FooterView extends Backbone.View
  tagName: "div"
  className: "navbar-header"
  template1: Handlebars.compile($("#footer-contacts-template").html())
  template2: Handlebars.compile($("#footer-transactions-template").html())
  template3: Handlebars.compile($("#footer-adjust-template").html())

  initialize: ->
    @listenTo(@model, 'change:page', @render)
    @listenTo(@model, 'change:balance', @render)
    @listenTo(@model, 'change:numSelected', @setButtonVisibility)
    @render()

  events: 
    "change input": "inputChanged"
    "change select": "inputChanged"
    "click .btn-send": "sendClicked"
    "click .btn-next": "nextClicked"

  render: ->
    page = @model.get("page") 
    switch page
      when "contacts"
        @$el.html(@template1(@toJSON()))
      when "transactions"
        @$el.html(@template2(@toJSON()))
        $(document).scrollTop($(document).height())
      when "addressbook"
        @$el.html(@template2(@toJSON()))
        @setButtonVisibility()
      when "adjust"
        @$el.html(@template3(@toJSON()))

    @$(".promise-select").val(@model.get("promise-select"))
    @$(".currecy-select").val(@model.get("currency-select"))

  setButtonVisibility: ->
    if @model.get("page") is "addressbook"
      @$(".btn-next").hide()
      @$(".btn-send").hide()

      if @model.get("numSelected") is 1
        @$(".btn-send").show()
      else if @model.get("numSelected") > 1
        @$(".btn-next").show()
    else if @model.get("page") is "adjust"
      @$(".btn-next").hide()
      @$(".btn-send").show()

  sendClicked: ->
    sign = @$el.find(".promise-select").val()
    balance = @$el.find(".balance-input").val()
    currency = @$el.find(".currency-select").val()
    reason = @$el.find(".reason-input").val()
    @model.resetInput()

    getSign = (share) ->
      if share > 0 then "+"
      else if share < 0 then "-"
      else throw new Exception("0 not allowed")

    switch @model.get("page")
      when "transactions"
        transaction = @createTransaction(app.entity.id, sign, balance, currency, reason)
        @updateBalance(app.entity, transaction)
        $(document).scrollTop($(document).height())
        @clear()

      when "addressbook"
        app.entity = app.selected.at(0)
        app.selected.reset()
        transaction = @createTransaction(app.entity.id, sign, balance, currency, reason)
        @updateBalance(app.entity, transaction)
        @model.set("page", "transactions")

      when "adjust"
        for contact in app.selected.models
          share = contact.get("share")
          sign = getSign(share)
          transaction = @createTransaction(contact.id, sign, share, currency, reason)
          @updateBalance(contact, transaction)

        app.selected.reset()
        @model.set("page", "contacts")

  updateBalance: (model, transaction) ->
    balance = model.get("balance")
    model.set("balance", balance + transaction.get("balance"))

  createTransaction: (id, sign, balance, currency, reason) ->
    transaction = new app.TransactionModel
    app.transactions.add(transaction)
    transaction.save
      from: "XXXme"
      to: id
      balance: parseFloat(sign + balance)
      currency: currency
      reason: reason
      date: new Date().getTime()
      status: "inflight"
    transaction

  nextClicked: ->
    @model.set "page", "adjust"

  clear: ->
    @$el.find(".promise-select").val("+")
    @$el.find(".balance-input").val(0)
    @$el.find(".currency-select").val("€")
    @$el.find(".reason-input").val("")

  inputChanged: (e) ->
    t = $(e.currentTarget)
    id = t.attr("id")
    val = t.val()
    @model.set(id, val)

  # XXX: Better way to introduce "viewmodel" prperties?
  toJSON: ->
    res = @model.toJSON() 
    res.hideButton = @model.get("numSelected") is 0 and @model.get("page") is "addressbook"
    res.showNextButton = @model.get("numSelected") >= 2 and @model.get("page") is "addressbook"
    res
