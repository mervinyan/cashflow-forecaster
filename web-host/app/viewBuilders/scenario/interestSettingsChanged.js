module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'interestSettingsChanged',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'update');