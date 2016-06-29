module.exports = require('cqrs-domain').defineCommand({
  name: 'deleteForecast'
}, function (data, aggregate) {
  aggregate.apply('forecastDeleted', data);
});