module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'scenarioDeleted',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'delete');