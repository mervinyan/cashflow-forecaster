module.exports = require('cqrs-domain').defineCommand({
  name: 'deleteBudget'
}, function (data, aggregate) {
  aggregate.apply('budgetDeleted', data);
});