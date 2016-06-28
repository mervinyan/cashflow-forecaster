module.exports = require('cqrs-domain').defineCommand({
  name: 'changeAlertSettings'
}, function (data, aggregate) {
  aggregate.apply('alertSettingsChanged', data);
});