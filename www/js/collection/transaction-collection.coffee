class app.TransactionCollection extends Backbone.Collection
  url: '/transactions'

  model: app.TransactionModel

  comparator: "date"

app.transactions = new app.TransactionCollection
