module.exports = require('cqrs-domain').defineEvent({
  name: 'budgetCreated'
},
function (data, aggregate) {
  aggregate.set(data);
});