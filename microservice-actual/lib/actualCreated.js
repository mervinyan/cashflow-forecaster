module.exports = require('cqrs-domain').defineEvent({
  name: 'actualCreated'
},
function (data, aggregate) {
  aggregate.set(data);
});