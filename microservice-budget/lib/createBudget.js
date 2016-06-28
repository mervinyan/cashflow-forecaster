module.exports = require('cqrs-domain').defineCommand({
  name: 'createBudget'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('budgetCreated', data);
});