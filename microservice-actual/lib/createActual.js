module.exports = require('cqrs-domain').defineCommand({
  name: 'createActual'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('actualCreated', data);
});