module.exports = require('cqrs-domain').defineCommand({
  name: 'importActual'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('actualImported', data);
});