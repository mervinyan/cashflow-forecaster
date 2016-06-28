module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'alertSettingsChanged',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'update');