'use strict';

app

  .controller('BudgetsCtrl', ['$scope', 'StoreService', '$filter', 'user',
    function($scope, StoreService, $filter, user) {

      $scope.aggregate = "budget";

      var store = StoreService.createForController($scope);
      store.for($scope.aggregate).do(function () {
      });

      $scope.user = user;

      $scope.budget_types = {
        income: "Income",
        expense: "Expense"
      };

      $scope.repeat_frequencies = [];
      $scope.repeat_frequencies.push({key: "once", label: "Once"});
      $scope.repeat_frequencies.push({key: "daily", label: "Daily"});
      $scope.repeat_frequencies.push({key: "weekly", label: "Weekly"});
      // $scope.repeat_frequencies.push({key: "biweekly", label: "Biweekly"});
      // $scope.repeat_frequencies.push({key: "semimonthly", label: "Semimonthly"});
      $scope.repeat_frequencies.push({key: "monthly", label: "Monthly"});
      // $scope.repeat_frequencies.push({key: "quarterly", label: "Quarterly"});
      $scope.repeat_frequencies.push({key: "yearly", label: "Yearly"});

      $scope.repeat_intervals = [];
      for (var i = 1; i < 31; i++) {
         $scope.repeat_intervals.push({key: i.toString(), label: i.toString()});
      }

    }])

  .controller('BudgetsListCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'budgetRepository', 'categoryRepository', 'scenarioRepository', '$filter', 'ngTableParams', 'toastr', '_', 
    function($scope, CQRS, DenormalizationService, budgetRepository, categoryRepository, scenarioRepository, $filter, ngTableParams, toastr, _) {

      var eventName = "budgetDeleted";
      var commandName = "deleteBudget";

      var budgetDeletedDenormalizationService = DenormalizationService.getDenormalizerFunctions(eventName, $scope.aggregate);
      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        var existingBudget = $filter('filter')($scope.budgets, { id: data.payload.id }, true)[0];

        var index = $scope.budgets.indexOf(existingBudget);
        if (index > -1) {
          $scope.budgets.splice(index, 1);
        }

        toastr.success('Budget Removed!', 'Budget has been removed');
      });

      // Delete CRUD operation
      $scope.delete = function (category) {
        if (confirm('Are you sure?')) {
          CQRS.sendCommand({
            id:_.uniqueId('msg'),
            command: commandName,
            aggregate: { 
              name: $scope.aggregate
            },
            payload: { 
              id: category.id
            },
          });
        }
      }
      //////////////////////////// *Delete CRUD operation

        // Initialize table
        var getCategoriesPromise = categoryRepository.query().$promise;
        getCategoriesPromise
        .then(function (result) {
          $scope.categories = result.items;

         return scenarioRepository.query().$promise;
        })
        .then(function(result) {
          $scope.scenarios = result.items;

          return budgetRepository.query().$promise;
        })
        .then(function (result) {
          $scope.budgets = result.items;

          //extend array
          function extendArray(){
            angular.forEach($scope.budgets, function(value, key){
              if (value.category_id){
                var existingCategory = $filter('filter')($scope.categories, { id: value.category_id }, true)[0];
                if (existingCategory != null && existingCategory != undefined) {
                  value.category = existingCategory;
                }
              }
              if (value.scenario_id){
                var existingScenario = $filter('filter')($scope.scenarios, { id: value.scenario_id }, true)[0];
                if (existingScenario != null && existingScenario != undefined) {
                  value.scenario = existingScenario;
                }
              }
            });
          }
          extendArray();
          ///////////////////////////////////////////// *extend array

          // watch data in scope, if change reload table
          $scope.$watchCollection('budgets', function(newVal, oldVal){
            if (newVal !== oldVal) {
              extendArray();
              $scope.tableParams.reload();
            }
          });

          $scope.$watch('searchText', function(newVal, oldVal){
            if (newVal !== oldVal) {
              $scope.tableParams.reload();
            }
          });
          ///////////////////////////////////////////// *watch data in scope, if change reload table

          $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
              id: 'asc'     // initial sorting
            }
          }, {
            total: $scope.budgets.length, // length of data
            getData: function($defer, params) {
              // use build-in angular filter
              var orderedData = params.sorting() ?
                $filter('orderBy')($scope.budgets, params.orderBy()) :
                $scope.budgets;

              orderedData = $filter('filter')(orderedData, $scope.searchText);
              params.total(orderedData.length);

              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        });
        ////////////////////////////////////////// *Initialize table

      }])

  .controller('NewBudgetCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'budgetRepository', 'categoryRepository', 'scenarioRepository', '$state', '$filter', 'toastr', '_',
    function($scope, CQRS, DenormalizationService, budgetRepository, categoryRepository, scenarioRepository, $state, $filter, toastr,  _) {

      $scope.budget = {type: "expense", repeat_frequency: "once", starts_on: new Date(), repeat_end_option: "occurrences", repeat_interval: "1"};

      var eventName = "budgetCreated";
      var commandName = "createBudget";

      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        toastr.success('Budget Added!', 'Budget has been created');
        $state.go('app.budgets.list', {}, {reload: true});
      });

            $scope.ok = function () {
                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.budget
                });
            };

        var getCategoriesPromise = categoryRepository.query().$promise;
        getCategoriesPromise
        .then(function (result) {

          $scope.categories = result.items;

          $scope.childCategories = [];
          //extend array
          angular.forEach($scope.categories, function (value, key) {
            if (value.parentId){
              var existingCategory = $filter('filter')($scope.categories, { id: value.parentId }, true)[0];
              if (existingCategory != null && existingCategory != undefined) {
                value.parentName = existingCategory.name;
                $scope.childCategories.push(value);
              }
            } else {
              if ($filter('filter')($scope.categories, {parentId: value.id}).length === 0) {
                $scope.childCategories.push(value);
              }
            }
          });

          return scenarioRepository.query().$promise;
        })
        .then(function(result) {
          $scope.scenarios = result.items;
        });
      }])

  .controller('EditBudgetCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'budgetRepository', 'categoryRepository', 'scenarioRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
    function($scope, CQRS, DenormalizationService, budgetRepository, categoryRepository, scenarioRepository, $state, $stateParams, $filter, toastr,  _) {
      
      $scope.editing = true;

      var budgetId = $stateParams.id;
      var eventName = "budgetChanged";
      var commandName = "changeBudget";

      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        toastr.success('Budget Saved!', 'Budget has been saved');
        $state.go('app.budgets.list', {}, {reload: true});
      });

            $scope.ok = function (form) {
              if ($scope.budget.repeat_end_option == 'occurrences') {
                $scope.budget.repeat_until = '';
              } else if ($scope.budget.repeat_end_option == 'until') {
                $scope.budget.repeat_occurrences = 0;
              }
console.log($scope.budget);
                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.budget
                });
            };


      var getBudgetPromise =budgetRepository.get({ id: budgetId }).$promise;
      getBudgetPromise
        .then(function (result) {
          $scope.budget = result;

console.log($scope.budget);

          $scope.budget.starts_on = new Date($scope.budget.starts_on);
          if ( $scope.budget.repeat_until  != null && scope.budget.repeat_until != undefined) {
            $scope.budget.repeat_until = new Date($scope.budget.repeat_until);
          }          
          return categoryRepository.query().$promise;
        }, function(){

          $state.go('app.budgets.list', {}, {reload: true});
        })
        .then(function (result) {

          $scope.categories = result.items;

          $scope.childCategories = [];
          //extend array
          angular.forEach($scope.categories, function (value, key) {
            if (value.parentId){
              var existingCategory = $filter('filter')($scope.categories, { id: value.parentId }, true)[0];
              if (existingCategory != null && existingCategory != undefined) {
                value.parentName = existingCategory.name;
                $scope.childCategories.push(value);
              }
            } else {
              if ($filter('filter')($scope.categories, {parentId: value.id}).length === 0) {
                $scope.childCategories.push(value);
              }
            }
          });
          return scenarioRepository.query().$promise;
        })
        .then(function(result) {
          $scope.scenarios = result.items;
        });
    }]);
