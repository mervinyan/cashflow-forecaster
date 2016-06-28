module.exports = require('cqrs-domain').defineEvent({
  name: 'accountClosed'
},
function (data, aggregate) {
  aggregate.set(data);
});