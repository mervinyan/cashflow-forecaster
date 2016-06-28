module.exports = require('cqrs-domain').defineEvent({
  name: 'budgetChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});