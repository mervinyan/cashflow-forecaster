module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'balanceSettingsChanged',
  aggregate: 'scenario',
  id: 'payload.id'
}, 'update');