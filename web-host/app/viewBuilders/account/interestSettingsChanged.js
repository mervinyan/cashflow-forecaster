module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'interestSettingsChanged',
  aggregate: 'account',
  id: 'payload.id'
}, 'update');