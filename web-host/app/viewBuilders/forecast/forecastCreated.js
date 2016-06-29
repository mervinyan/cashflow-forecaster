module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'forecastCreated',
  aggregate: 'forecast',
  id: 'payload.id'
}, 'create');