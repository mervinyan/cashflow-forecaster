module.exports = require('cqrs-saga').defineSaga({
  name: 'budgetDeleted',
  aggregate: 'budget',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
function (evt, saga, callback) {
  var budgetId =  evt.payload.id;
console.log(budgetId);
  const forecastsRepo = require('../viewBuilders/forecast/collection');
  forecastsRepo.findViewModels({ 'budget_id': budgetId }, (err, budgets) => {
    budgets.forEach(function(entry) {
		var cmd = {
		  command: 'deleteForecast',
		  aggregate: { 
			  name: 'forecast'
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
