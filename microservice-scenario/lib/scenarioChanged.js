module.exports = require('cqrs-domain').defineEvent({
  name: 'scenarioChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});