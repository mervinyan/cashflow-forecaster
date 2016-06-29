module.exports = require('cqrs-domain').defineEvent({
  name: 'forecastCreated'
},
function (data, aggregate) {
  aggregate.set(data);
});