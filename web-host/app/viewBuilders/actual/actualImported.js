module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'actualImported',
  aggregate: 'actual',
  id: 'payload.id'
}, 'create');