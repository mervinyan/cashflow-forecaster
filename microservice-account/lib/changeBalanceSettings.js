module.exports = require('cqrs-domain').defineCommand({
  name: 'changeBalanceSettings'
}, function (data, aggregate) {
  aggregate.apply('balanceSettingsChanged', data);
});