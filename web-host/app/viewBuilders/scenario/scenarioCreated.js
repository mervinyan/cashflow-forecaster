module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'scenarioCreated',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'create');