module.exports = require('cqrs-saga').defineSaga({
  name: 'balanceSettingsChanged',
  aggregate: 'account',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
  function (evt, saga, callback) {
    var account_id = evt.payload.id;

    const scenarioRepo = require('../viewBuilders/scenario/collection');
    scenarioRepo.findViewModels({ 'account_id': account_id, 'type': 'primary' }, (err, scenarios) => {
      scenarios.forEach(function (entry) {
        var cmd = {
          command: 'changeBalanceSettings',
          aggregate: {
            name: 'scenario'
          },
          payload: {
            id: entry.id,
            opening_balance: evt.payload.balance,
            opening_balance_as_of_date: evt.payload.balance_as_of_date
          },
          meta: evt.meta
        };

        saga.addCommandToSend(cmd);
      });

      saga.commit(callback);
    });

  });
