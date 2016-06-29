module.exports = require('cqrs-domain').defineCommand({
  name: 'createForecast'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('forecastCreated', data);
});