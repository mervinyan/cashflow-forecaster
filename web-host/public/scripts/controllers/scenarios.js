'use strict';

app

    .controller('ScenariosCtrl', ['$scope', 'StoreService', '$filter', 'user',
        function ($scope, StoreService, $filter, user) {

            $scope.aggregate = "scenario";

            var store = StoreService.createForController($scope);
            store.for($scope.aggregate).do(function () {
            });

            $scope.user = user;
            $scope.scenario = {};
            
           $scope.interest_payment_frequencies = {
                no_interest: "No Interest",
                every_quarter: 'Every Quarter',
                every_month: "Every Month",
                every_week: "Every Week",
                every_fotnight: "Every Fortnight"
            };

        }])

    .controller('ScenariosListCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'scenarioRepository', 'accountRepository', '$filter', 'ngTableParams', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, scenarioRepository, accountRepository, $filter, ngTableParams, toastr, _) {

        // Initialize table
        var getAccountsPromise = accountRepository.query().$promise;
        getAccountsPromise
        .then(function (result) {
          $scope.accounts = result.items;

         return scenarioRepository.query().$promise;
        })
        .then(function (result) {
          $scope.scenarios = result.items;
          //extend array
          function extendArray(){
            angular.forEach($scope.scenarios, function(value, key){
              if (value.account_id){
                var existingAccount = $filter('filter')($scope.accounts, { id: value.account_id }, true)[0];
                if (existingAccount != null && existingAccount != undefined) {
                  value.account = existingAccount;
                }
              }
            });
          }
          extendArray();
          ///////////////////////////////////////////// *extend array

          // watch data in scope, if change reload table
          $scope.$watchCollection('scenarios', function(newVal, oldVal){
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
                            total: $scope.scenarios.length, // length of data
                            getData: function ($defer, params) {
                                // use build-in angular filter
                                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.scenarios, params.orderBy()) :
                                    $scope.scenarios;

                                orderedData = $filter('filter')(orderedData, $scope.searchText);
                                params.total(orderedData.length);

                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                });
            ////////////////////////////////////////// *Initialize table

        }])

    .controller('NewScenarioCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'scenarioRepository', 'accountRepository', '$state', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, scenarioRepository, accountRepository, $state, $filter, toastr, _) {

            var eventName = "scenarioCreated";
            var commandName = "createScenario";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Scenario Added!', 'Scenario has been created');
                $state.go('app.scenarios.list', {}, { reload: true });
            });

            $scope.scenario.interest_payment_frequency = 'no_interest';
            $scope.ok = function () {
                $scope.scenario.type = 'secondary';

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.scenario
                });
            };
            /////////////////////// *Submit operation
            console.log($scope);
        var getAccountsPromise = accountRepository.query().$promise;
        getAccountsPromise
        .then(function (result) {
          $scope.accounts = result.items;

         return scenarioRepository.query().$promise;
        });
        
    }])

    .controller('EditScenarioCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'scenarioRepository', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, scenarioRepository, accountRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.editing = true;

            var scenarioId = $stateParams.id;

            var eventName = "scenarioChanged";
            var commandName = "changeScenario";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Scenario Saved!', 'Scenario has been saved');
                $state.go('app.scenarios.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.scenario
                });
            };

            var getScenarioPromise = scenarioRepository.get({ id: scenarioId }).$promise;
            getScenarioPromise
                .then(function (result) {
                    $scope.scenario = result;
                    return accountRepository.query().$promise;
                }, function () {

                    $state.go('app.scenarios.list', {}, { reload: true });
                })
                .then(function (result) {

         $scope.accounts = result.items;

      });
        }])

    .controller('ScenarioBalanceSettingsCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'scenarioRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, scenarioRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.editing = true;

            var scenarioId = $stateParams.id;

            var eventName = "balanceSettingsChanged";
            var commandName = "changeBalanceSettings";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Balance Settings Changed!', 'Scenario balance settings has been changed');
                $state.go('app.scenarios.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.scenario
                });
            };

            var getScenarioPromise = scenarioRepository.get({ id: scenarioId }).$promise;
            getScenarioPromise
                .then(function (result) {
                    $scope.scenario = result;
                    return getScenarioPromise;
                }, function () {

                    $state.go('app.scenarios.list', {}, { reload: true });
                });
        }])

    .controller('ScenarioAlertSettingsCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'scenarioRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, scenarioRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.editing = true;

            var scenarioId = $stateParams.id;

            var eventName = "alertSettingsChanged";
            var commandName = "changeAlertSettings";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Scenario Alert Settings Changed!', 'Scenario alert settings has been saved');
                $state.go('app.scenarios.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.scenario
                });
            };

            var getScenarioPromise = scenarioRepository.get({ id: scenarioId }).$promise;
            getScenarioPromise
                .then(function (result) {
                    $scope.scenario = result;
                    return getScenarioPromise;
                }, function () {

                    $state.go('app.scenarios.list', {}, { reload: true });
                });
        }]);                        



