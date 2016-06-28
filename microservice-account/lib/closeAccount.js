module.exports = require('cqrs-domain').defineCommand({
  name: 'closeAccount'
}, function (data, aggregate) {
  aggregate.apply('accountClosed', data);
});