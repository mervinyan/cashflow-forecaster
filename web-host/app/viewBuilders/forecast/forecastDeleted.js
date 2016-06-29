module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'forecastDeleted',
  aggregate: 'forecast',
  id: 'payload.id'
}, 'delete');