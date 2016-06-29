module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'actualChanged',
  aggregate: 'actual',
  id: 'payload.id'
}, 'update');