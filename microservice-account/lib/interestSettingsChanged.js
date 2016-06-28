module.exports = require('cqrs-domain').defineEvent({
  name: 'interestSettingsChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});