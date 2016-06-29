module.exports = require('cqrs-domain').defineEvent({
  name: 'forecastDeleted'
},
function (data, aggregate) {
  aggregate.destroy();
});