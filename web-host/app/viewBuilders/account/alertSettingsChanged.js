module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'alertSettingsChanged',
  aggregate: 'account',
  id: 'payload.id'
}, 'update');