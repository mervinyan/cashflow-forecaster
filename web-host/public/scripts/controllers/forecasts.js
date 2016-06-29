'use strict';

app

  .controller('ForecastsCtrl', ['$scope', 'StoreService', '$filter', 'user',
    function ($scope, StoreService, $filter, user) {

      $scope.aggregate = "forecast";

      var store = StoreService.createForController($scope);
      store.for($scope.aggregate).do(function () {
      });

      $scope.user = user;

    }])

  .controller('ForecastsListCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'forecastRepository', 'categoryRepository', 'scenarioRepository', '$filter', 'ngTableParams', 'toastr', '_',
    function ($scope, CQRS, DenormalizationService, forecastRepository, categoryRepository, scenarioRepository, $filter, ngTableParams, toastr, _) {


      // Initialize table
      var getCategoriesPromise = categoryRepository.query().$promise;
      getCategoriesPromise
        .then(function (result) {
          $scope.categories = result.items;

          return scenarioRepository.query().$promise;
        })
        .then(function (result) {
          $scope.scenarios = result.items;
          return forecastRepository.query().$promise;
        })
        .then(function (result) {
          $scope.forecasts = result.items;
          //extend array
          function extendArray() {
            angular.forEach($scope.forecasts, function (value, key) {
              if (value.category_id) {
                var existingCategory = $filter('filter')($scope.categories, { id: value.category_id }, true)[0];
                if (existingCategory != null && existingCategory != undefined) {
                  value.category = existingCategory;
                }
              }
              if (value.scenario_id) {
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
          $scope.$watchCollection('forecasts', function (newVal, oldVal) {
            if (newVal !== oldVal) {
              extendArray();
              $scope.tableParams.reload();
            }
          });

          $scope.$watch('searchText', function (newVal, oldVal) {
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
              total: $scope.forecasts.length, // length of data
              getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                  $filter('orderBy')($scope.forecasts, params.orderBy()) :
                  $scope.forecasts;

                orderedData = $filter('filter')(orderedData, $scope.searchText);
                params.total(orderedData.length);

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
              }
            });
        });
      ////////////////////////////////////////// *Initialize table

    }]);
