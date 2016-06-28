module.exports = require('cqrs-domain').defineEvent({
  name: 'balanceSettingsChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});