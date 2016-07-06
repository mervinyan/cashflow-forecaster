module.exports = require('cqrs-saga').defineSaga({
  name: 'interestSettingsChanged',
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
          command: 'changeInterestSettings',
          aggregate: {
            name: 'scenario'
          },
          payload: {
            id: entry.id,
            interest_payment_frequency: evt.payload.interest_payment_frequency,
            interest_rate_per_annum: evt.payload.interest_rate_per_annum
          },
          meta: evt.meta
        };

        saga.addCommandToSend(cmd);
      });

      saga.commit(callback);
    });

  });
