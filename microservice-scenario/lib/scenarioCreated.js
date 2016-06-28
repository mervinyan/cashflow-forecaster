module.exports = require('cqrs-domain').defineEvent({
  name: 'scenarioCreated'
},
function (data, aggregate) {
  aggregate.set(data);
});