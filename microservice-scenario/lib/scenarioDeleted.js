module.exports = require('cqrs-domain').defineEvent({
  name: 'scenarioDeleted'
},
function (data, aggregate) {
  aggregate.destroy();
});