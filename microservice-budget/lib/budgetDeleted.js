module.exports = require('cqrs-domain').defineEvent({
  name: 'budgetDeleted'
},
function (data, aggregate) {
  aggregate.destroy();
});