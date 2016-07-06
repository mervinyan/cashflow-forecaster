module.exports = require('cqrs-saga').defineSaga({
  name: 'alertSettingsChanged',
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
          command: 'changeAlertSettings',
          aggregate: {
            name: 'scenario'
          },
          payload: {
            id: entry.id,
            alert_enabled: evt.payload.alert_enabled,
            alert_amount: evt.payload.alert_amount
          },
          meta: evt.meta
        };

        saga.addCommandToSend(cmd);
      });

      saga.commit(callback);
    });

  });
