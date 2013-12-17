class app.ContactModel extends Backbone.Model
  defaults:
    id: ""
    name: ""
    username: ""
    balance: ""
    currency: ""
    reason: ""
    date: null

  initialize: ->
    @set "link", "/#/contacts/#{@id}"
