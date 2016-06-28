module.exports = require('cqrs-eventdenormalizer').defineViewBuilder({
  name: 'accountClosed',
  aggregate: 'account',
  id: 'payload.id'
}, 'update');