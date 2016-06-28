module.exports = require('cqrs-domain').defineCommand({
  name: 'changeScenario'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('scenarioChanged', data);
});