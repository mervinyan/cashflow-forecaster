module.exports = require('cqrs-domain').defineCommand({
  name: 'deleteScenario'
}, function (data, aggregate) {
  aggregate.apply('scenarioDeleted', data);
});