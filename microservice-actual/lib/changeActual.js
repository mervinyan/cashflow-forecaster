module.exports = require('cqrs-domain').defineCommand({
  name: 'changeActual'
}, function (data, aggregate) {
  aggregate.apply('actualChanged', data);
});