// var moment = require('moment');

module.exports = require('cqrs-saga').defineSaga({
  name: 'budgetCreated',
  aggregate: 'budget',
  containingProperties: ['payload.id'],
  id: 'payload.id',
},
  function (evt, saga, callback) {
    var budget_id = evt.payload.id;
console.log("saga-budget budgetCreated id " + budget_id);    
    var dates = [];
    // var start = moment(evt.payload.starts_on);
    var start = evt.payload.starts_on;
    console.log(start);
    if (evt.payload.repeat_frequency == 'once') {
      dates.push(start);
    } 
    // else {
    //   var repeat_interval = parseInt(evt.payload.repeat_interval);
    //   if (evt.payload.repeat_end_option == 'occurrencies') {
    //     for (var i = 0; i < evt.payload.repeat_occurrencies; i++) {
    //       if (evt.payload.repeat_frequency == 'daily') {
    //         dates.push(moment(start).add(i * repeat_interval, 'days'));
    //       } else if (evt.payload.repeat_frequency == 'weekly') {
    //          dates.push(moment(start).add(i * 7 * repeat_interval, 'days'));
    //       } else if (evt.payload.repeat_frequency == 'monthly') {
    //          dates.push(moment(start).add(i * repeat_interval, 'months'));
    //       } else if (evt.payload.repeat_frequency == 'yearly') {
    //          dates.push(moment(start).add(i * repeat_interval, 'years'));
    //       }
    //     }

    //   } else if (evt.payload.repeat_end_option == 'until') {
    //     var end = moment(evt.payload.repeat_until);
    //     dates.push(moment(start));
    //     var i = 1; 
    //     if (evt.payload.repeat_frequency == 'daily') {
    //         while (moment(start).add(i * repeat_interval, 'days') <= moment(end)) {
    //           dates.push(moment(start).add(i * repeat_interval, 'days'));
    //           i++;
    //         }
    //       } else if (evt.payload.repeat_frequency == 'weekly') {
    //         while (moment(start).add(i * 7 * repeat_interval, 'days') <= moment(end)) {
    //           dates.push(moment(start).add(i * 7 * repeat_interval, 'days'));
    //           i++;
    //         }
    //       } else if (evt.payload.repeat_frequency == 'monthly') {
    //         while (moment(start).add(i * repeat_interval, 'months') <= moment(end)) {
    //           dates.push(moment(start).add(i * repeat_interval, 'months'));
    //           i++;
    //         }            
    //       } else if (evt.payload.repeat_frequency == 'yearly') {
    //         while (moment(start).add(i * repeat_interval, 'years') <= moment(end)) {
    //           dates.push(moment(start).add(i * repeat_interval, 'years'));
    //           i++;
    //         }     
    //       }
    //   }
    // }
    var scenario_ids = [];
    scenario_ids.push(evt.payload.scenario_id);
    if (evt.payload.transfer_scenario_id) {
      scenario_ids.push(evt.payload.transfer_scenario_id);
    }
    for (var i = 0; i < dates.length; i++) {
        var cmd = {
          command: 'createForecast',
          aggregate: {
            name: 'forecast'
          },
          payload: {
            budget_id: budget_id,
            category_id: evt.payload.category_id,
            scenario_id: evt.payload.scenario_id,
            type: evt.payload.type,
            amount: evt.payload.amount,
            date: dates[i],
            description: evt.payload.description
          },
          meta: evt.meta
        };

        console.log(cmd);

        saga.addCommandToSend(cmd);

        if (evt.payload.transfer_scenario_id) {
          var budget_type = evt.payload.type == 'expense' ? 'income' : 'expense';
            var cmd1 = {
            command: 'createForecast',
            aggregate: {
              name: 'forecast'
            },
            payload: {
              budget_id: budget_id,
              category_id: evt.payload.category_id,
              scenario_id: evt.payload.transfer_scenario_id,
              type: budget_type,
              amount: evt.payload.amount,
              date: dates[i],
              description: evt.payload.description
            },
            meta: evt.meta
          };

          console.log(cmd1);

          saga.addCommandToSend(cmd1);
        }


    }
    saga.commit(callback);

  });
