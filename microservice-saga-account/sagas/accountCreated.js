module.exports = require('cqrs-saga').defineSaga({
  name: 'accountCreated',
  aggregate: 'account',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
  function (evt, saga, callback) {
    var account_id = evt.payload.id;

    var cmd = {
      command: 'createScenario',
      aggregate: {
        name: 'scenario'
      },
      payload: {
        name: evt.payload.name,
        account_id: evt.payload.id,
        type: 'primary'
      },
      meta: evt.meta
    };

    saga.addCommandToSend(cmd);
    saga.commit(callback);

  });
