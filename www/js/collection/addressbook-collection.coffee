class app.AddressbookCollection extends Backbone.Collection
  url: "/contacts"

  model: app.ContactModel

  comparator: "name"

app.addressbook = new app.AddressbookCollection
