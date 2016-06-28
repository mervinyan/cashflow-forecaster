module.exports = require('cqrs-domain').defineEvent({
  name: 'alertSettingsChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});