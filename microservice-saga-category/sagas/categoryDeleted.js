module.exports = require('cqrs-saga').defineSaga({
  name: 'categoryDeleted',
  aggregate: 'category',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
function (evt, saga, callback) {
  var categoryId =  evt.payload.id;
  
  const budgetsRepo = require('../viewBuilders/budget/collection');
  budgetsRepo.findViewModels({ category_id: categoryId }, (err, budgets) => {
    budgets.forEach(function(entry) {
      var cmd = {
        command: 'deleteBudget',
        aggregate: { 
          name: 'budget'
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
