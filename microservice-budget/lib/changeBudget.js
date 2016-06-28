module.exports = require('cqrs-domain').defineCommand({
  name: 'changeBudget'
}, function (data, aggregate) {
  aggregate.apply('budgetChanged', data);
});