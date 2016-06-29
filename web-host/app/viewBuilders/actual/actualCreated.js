module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'actualCreated',
  aggregate: 'actual',
  id: 'payload.id'
}, 'create');