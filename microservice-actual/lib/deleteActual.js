module.exports = require('cqrs-domain').defineCommand({
  name: 'deleteActual'
}, function (data, aggregate) {
  aggregate.apply('actualDeleted', data);
});