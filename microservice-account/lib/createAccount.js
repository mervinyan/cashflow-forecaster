module.exports = require('cqrs-domain').defineCommand({
  name: 'createAccount'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('accountCreated', data);
});