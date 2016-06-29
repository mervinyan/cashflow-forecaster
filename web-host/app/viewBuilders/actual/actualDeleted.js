module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'actualDeleted',
  aggregate: 'actual',
  id: 'payload.id'
}, 'delete');