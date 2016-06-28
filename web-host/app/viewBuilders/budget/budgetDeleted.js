module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'budgetDeleted',
  aggregate: 'budget',
  id: 'payload.id'
}, 'delete');