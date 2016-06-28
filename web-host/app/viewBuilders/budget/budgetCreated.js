module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'budgetCreated',
  aggregate: 'budget',
  id: 'payload.id'
}, 'create');