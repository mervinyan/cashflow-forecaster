module.exports = require('cqrs-domain').defineEvent({
  name: 'actualImported'
},
function (data, aggregate) {
  aggregate.set(data);
});