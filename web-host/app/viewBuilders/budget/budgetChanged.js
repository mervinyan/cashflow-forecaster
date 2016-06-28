module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'budgetChanged',
  aggregate: 'budget',
  id: 'payload.id'
}, 'update');