module.exports = require('cqrs-domain').defineCommand({
  name: 'createScenario'
}, function (data, aggregate) {
  data.createdAt = new Date();
  aggregate.apply('scenarioCreated', data);
});