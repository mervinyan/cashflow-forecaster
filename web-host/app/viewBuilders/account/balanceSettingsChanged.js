module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'balanceSettingsChanged',
  aggregate: 'account',
  id: 'payload.id'
}, 'update');