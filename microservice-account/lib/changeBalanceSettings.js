module.exports = require('cqrs-domain').defineCommand({
  name: 'changeBalanceSettings'
}, function (data, aggregate) {
  console.log('micorservice-account:');
  console.log( aggregate);
  console.log('--------');
  aggregate.apply('balanceSettingsChanged', data);
});