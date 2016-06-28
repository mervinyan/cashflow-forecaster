module.exports = require('cqrs-saga').defineSaga({
  name: 'accountDeleted',
  aggregate: 'account',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
function (evt, saga, callback) {
  var accountId =  evt.payload.id;

  const senariosRepo = require('../viewBuilders/scenario/collection');
  senariosRepo.findViewModels({ 'account_id': accountId }, (err, scenarios) => {
    scenarios.forEach(function(entry) {
		var cmd = {
		  command: 'deleteScenario',
		  aggregate: { 
			  name: 'scenario'
		  },
		  payload: {
			  id : entry.id,
		  },
		  meta: evt.meta
		};

		saga.addCommandToSend(cmd);
    }); 
    
    saga.commit(callback);
  });

});
