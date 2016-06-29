'use strict';

app

  .controller('ActualsCtrl', ['$scope', '$parse', 'StoreService', '$filter', 'user',
    function($scope, $parse, StoreService, $filter, user) {

      $scope.aggregate = "actual";

      var store = StoreService.createForController($scope);
      store.for($scope.aggregate).do(function () {
      });

      $scope.user = user;

      $scope.actual_types = {
        credit: "Credit",
        debit: "Debit"
      };

    }])

  .controller('ActualsListCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'actualRepository', 'categoryRepository', 'accountRepository', '$filter', 'ngTableParams', 'toastr', '_', 
    function($scope, CQRS, DenormalizationService, actualRepository, categoryRepository, accountRepository, $filter, ngTableParams, toastr, _) {

      var eventName = "actualDeleted";
      var commandName = "deleteActual";

      var actualDeletedDenormalizationService = DenormalizationService.getDenormalizerFunctions(eventName, $scope.aggregate);
      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        var existingActual = $filter('filter')($scope.actuals, { id: data.payload.id }, true)[0];

        var index = $scope.actuals.indexOf(existingActual);
        if (index > -1) {
          $scope.actuals.splice(index, 1);
        }

        toastr.success('Actual Removed!', 'Actual has been removed');
      });

      // Delete CRUD operation
      $scope.delete = function (actual) {
        if (confirm('Are you sure?')) {
          CQRS.sendCommand({
            id:_.uniqueId('msg'),
            command: commandName,
            aggregate: { 
              name: $scope.aggregate
            },
            payload: { 
              id: actual.id
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

         return accountRepository.query().$promise;
        })
        .then(function(result) {
          $scope.accounts = result.items;

          return actualRepository.query().$promise;
        })
        .then(function (result) {
          $scope.actuals = result.items;

          //extend array
          function extendArray(){
            angular.forEach($scope.actuals, function(value, key){
              if (value.category_id){
                var existingCategory = $filter('filter')($scope.categories, { id: value.category_id }, true)[0];
                if (existingCategory != null && existingCategory != undefined) {
                  value.category = existingCategory;
                }
              }
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
          $scope.$watchCollection('actuals', function(newVal, oldVal){
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
            total: $scope.actuals.length, // length of data
            getData: function($defer, params) {
              // use build-in angular filter
              var orderedData = params.sorting() ?
                $filter('orderBy')($scope.actuals, params.orderBy()) :
                $scope.actuals;

              orderedData = $filter('filter')(orderedData, $scope.searchText);
              params.total(orderedData.length);

              $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        });
        ////////////////////////////////////////// *Initialize table

      }])

  .controller('NewActualCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'actualRepository', 'categoryRepository', 'accountRepository', '$state', '$filter', 'toastr', '_',
    function($scope, CQRS, DenormalizationService, actualRepository, categoryRepository, accountRepository, $state, $filter, toastr,  _) {

      $scope.actual = {type: "credit", date: new Date()};

      var eventName = "actualCreated";
      var commandName = "createActual";

      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        toastr.success('Actual Added!', 'Actual has been created');
        $state.go('app.actuals.list', {}, {reload: true});
      });

            $scope.ok = function () {
                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.actual
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

          return accountRepository.query().$promise;
        })
        .then(function(result) {
          $scope.accounts = result.items;
        });
      }])

  .controller('EditActualCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'actualRepository', 'categoryRepository', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
    function($scope, CQRS, DenormalizationService, actualRepository, categoryRepository, accountRepository, $state, $stateParams, $filter, toastr,  _) {
      
      $scope.editing = true;

      var actualId = $stateParams.id;
      var eventName = "actualChanged";
      var commandName = "changeActual";

      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        toastr.success('Actual Saved!', 'Actual has been saved');
        $state.go('app.actuals.list', {}, {reload: true});
      });

            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.actual
                });
            };


      var getActualPromise = actualRepository.get({ id: actualId }).$promise;
      getActualPromise
        .then(function (result) {
          $scope.actual = result;

          $scope.actual.date = new Date($scope.actual.date);
          return categoryRepository.query().$promise;
        }, function(){

          $state.go('app.actuals.list', {}, {reload: true});
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
          return accountRepository.query().$promise;
        })
        .then(function(result) {
          $scope.accounts = result.items;
        });
    }])

  .controller('ImportActualCtrl', ['$scope', '$parse', 'CQRS', 'DenormalizationService', 'actualRepository', 'categoryRepository', 'accountRepository', '$state', '$filter', 'toastr', '_',
    function($scope, $parse, CQRS, DenormalizationService, actualRepository, categoryRepository, accountRepository, $state, $filter, toastr,  _) {

  $scope.csv = {
    	content: null,
    	header: true,
    	headerVisible: true,
    	separator: ',',
    	separatorVisible: true,
    	result: null,
    	encoding: 'ISO-8859-1',
    	encodingVisible: true,
    };

    var _lastGoodResult = '';
    $scope.toPrettyJSON = function (json, tabWidth) {
			var objStr = JSON.stringify(json);
			var obj = null;
			try {
				obj = $parse(objStr)({});
			} catch(e){
				// eat $parse error
				return _lastGoodResult;
			}

			var result = JSON.stringify(obj, null, Number(tabWidth));
			_lastGoodResult = result;

			return result;
    };

      $scope.import_actuals = {};

      // $scope.files = [];
      // $scope.percentage = 0;

      // $scope.upload = function () {
      //     uploadManager.upload();
      //     $scope.files = [];
      // };

      // $rootScope.$on('fileAdded', function (e, call) {
      //     $scope.files.push(call);
      //     $scope.$apply();
      // });

      // $rootScope.$on('uploadProgress', function (e, call) {
      //     $scope.percentage = call;
      //     $scope.$apply();
      // });

// $scope.readCSV = function() {
// 		// http get request to read CSV file content
// 		$http.get('/angular/sample.csv').success($scope.processData);
// 	};

      $scope.processData = function(allText) {
          // split content based on new line
          var allTextLines = allText.split(/\r\n|\n/);
          var headers = allTextLines[0].split(',');
          var lines = [];

          for ( var i = 0; i < allTextLines.length; i++) {
            // split content based on comma
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
              var tarr = [];
              for ( var j = 0; j < headers.length; j++) {
                tarr.push(data[j]);
              }
              lines.push(tarr);
            }
          }
          $scope.data = lines;
        };

      var eventName = "actualImported";
      var commandName = "importActual";

      DenormalizationService.registerDenormalizerFunction({
        viewModelName: $scope.aggregate,
        aggregateType: $scope.aggregate,
        eventName: eventName
      }, function (items, data) {
        toastr.success('Actual Imported!', 'Actual has been imported');
        $state.go('app.actuals.list', {}, {reload: true});
      });

            $scope.ok = function () {
              console.log($scope.import_actuals);
                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.import_actuals
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

          return accountRepository.query().$promise;
        })
        .then(function(result) {
          $scope.accounts = result.items;
        });
      }]);

