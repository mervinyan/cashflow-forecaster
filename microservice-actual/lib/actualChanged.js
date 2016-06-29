module.exports = require('cqrs-domain').defineEvent({
  name: 'actualChanged'
},
function (data, aggregate) {
  aggregate.set(data);
});