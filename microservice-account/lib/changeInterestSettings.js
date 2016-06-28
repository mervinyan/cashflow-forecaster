module.exports = require('cqrs-domain').defineCommand({
  name: 'changeInterestSettings'
}, function (data, aggregate) {
  aggregate.apply('interestSettingsChanged', data);
});