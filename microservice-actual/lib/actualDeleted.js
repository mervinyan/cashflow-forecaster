module.exports = require('cqrs-domain').defineEvent({
  name: 'actualDeleted'
},
function (data, aggregate) {
  aggregate.destroy();
});