module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'scenarioChanged',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'update');