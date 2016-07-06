'use strict';

app

    .controller('AccountsCtrl', ['$scope', 'StoreService', '$filter', 'user',
        function ($scope, StoreService, $filter, user) {

            $scope.aggregate = "account";

            var store = StoreService.createForController($scope);
            store.for($scope.aggregate).do(function () {
            });

            $scope.user = user;
            $scope.account = {};

            $scope.account_types = {
                checking: "Checking",
                saving: 'Saving',
                credit_card: "Credit Card",
                line_of_credit: "Line of Credit",
                mortgage: "Mortgage",
                investment_taxable: "Investment - Taxable",
                investment_non_taxable: "Investment - Non-Taxable"
            };

            $scope.currencies = {
                cnd: "Canadian Dollar - CAD ($)",
                usd: 'US Dollar - USD ($)'
            };

            $scope.brands = {
                amex: "American Express",
                master_card: "MasterCard",
                visa: "Visa"
            };

            $scope.rewards = {
                miles: "Miles",
                points: "Points",
                cashback: "Cashback",
                none: "None"
            };

            $scope.terms = {
                3: "3 Years",
                4: "4 Years",
                5: "5 Years",
                6: "6 Years",
                7: "7 Years",
                10: "10 Years",
                15: "15 Years",
                20: "20 Years",
                30: "30 Years"
            };

            $scope.mortgage_types = {
                fixed: "Fixed",
                variable: "Variable",
                arm: "ARM",
                other: "Other",
                unknown: "Unknown"
            };

        }])

    .controller('AccountsListCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$filter', 'ngTableParams', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $filter, ngTableParams, toastr, _) {

            var eventNameClose = "accountClosed";
            var commandNameClose = "closeAccount";

            var accountClosedDenormalizationService = DenormalizationService.getDenormalizerFunctions(eventNameClose, $scope.aggregate);
            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventNameClose
            }, function (items, data) {
                var existingAccount = $filter('filter')($scope.accounts, { id: data.payload.id }, true)[0];

                if (existingAccount != null && existingAccount != undefined) {
                    existingAccount.status = data.payload.status;
                }

                toastr.success('Account Closed!', 'Account has been closed');
            });

            $scope.close = function (account, status) {
                if (confirm('Are you sure?')) {
                    CQRS.sendCommand({
                        id: _.uniqueId('msg'),
                        command: commandNameClose,
                        aggregate: {
                            name: $scope.aggregate
                        },
                        payload: {
                            id: account.id,
                            status: 'closed'
                        },
                    });
                }
            };


            var eventNameDelete = "accountDeleted";
            var commandNameDelete = "deleteAccount";

            var accountDeletedDenormalizationService = DenormalizationService.getDenormalizerFunctions(eventNameDelete, $scope.aggregate);
            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventNameDelete
            }, function (items, data) {
                var existingAccount = $filter('filter')($scope.accounts, { id: data.payload.id }, true)[0];

                var index = $scope.categories.indexOf(existingAccount);
                if (index > -1) {
                    $scope.accounts.splice(index, 1);
                }

                toastr.success('Account Removed!', 'Account has been removed');
            });

            // Delete CRUD operation
            $scope.delete = function (account) {
            if (confirm('Are you sure?')) {
                CQRS.sendCommand({
                id:_.uniqueId('msg'),
                command: commandNameDelete,
                aggregate: { 
                    name: $scope.aggregate
                },
                payload: { 
                    id: account.id
                },
                });
            }
            }
            // Initialize table
            var getAccountsPromise = accountRepository.query().$promise;
            getAccountsPromise
                .then(function (result) {
                    $scope.accounts = result.items;

                    // watch data in scope, if change reload table
                    $scope.$watchCollection('accounts', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
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
                            total: $scope.accounts.length, // length of data
                            getData: function ($defer, params) {
                                // use build-in angular filter
                                var orderedData = params.sorting() ?
                                    $filter('orderBy')($scope.accounts, params.orderBy()) :
                                    $scope.accounts;

                                orderedData = $filter('filter')(orderedData, $scope.searchText);
                                params.total(orderedData.length);

                                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                            }
                        });
                });
            ////////////////////////////////////////// *Initialize table

        }])

    .controller('NewAccountCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$state', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $state, $filter, toastr, _) {

            var eventName = "accountCreated";
            var commandName = "createAccount";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Account Added!', 'Account has been created');
                $state.go('app.accounts.list', {}, { reload: true });
            });

            $scope.ok = function () {
                $scope.account.status = 'active';

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.account
                });
            };
            /////////////////////// *Submit operation
            console.log($scope);
            var getAccountsPromise = accountRepository.query().$promise;
            getAccountsPromise.then(function (result) {
                $scope.accounts = result.items;
            });
        }])

    .controller('EditAccountCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.editing = true;

            var accountId = $stateParams.id;

            var eventName = "accountChanged";
            var commandName = "changeAccount";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Account Saved!', 'Account has been saved');
                $state.go('app.accounts.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: $scope.account
                });
            };

            var getAccountPromise = accountRepository.get({ id: accountId }).$promise;
            getAccountPromise
                .then(function (result) {
                    $scope.account = result;
                    return getAccountPromise;
                }, function () {

                    $state.go('app.accounts.list', {}, { reload: true });
                });
        }])

    .controller('ShowAccountCtrl', ['$scope', 'accountRepository', '$state', '$stateParams', '$filter',
        function ($scope, accountRepository, $state, $stateParams, $filter) {
            var accountId = $stateParams.id;
            var getAccountPromise = accountRepository.get({ id: accountId }).$promise;
            getAccountPromise
                .then(function (result) {

                    $scope.account = result;
                }, function () {

                    $state.go('app.accounts.list', {}, { reload: true });
                });
        }])

    .controller('AccountBalanceSettingsCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.editing = true;

            $scope.balance_settings = {};

            var accountId = $stateParams.id;

            var eventName = "balanceSettingsChanged";
            var commandName = "changeBalanceSettings";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Balance Settings Changed!', 'Account balance settings has been changed');
                $state.go('app.accounts.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {
                var cmd = {
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: {
                        id: $scope.account.id,
                        balance: $scope.balance_settings.balance,
                        balance_as_of_date: $scope.balance_settings.balance_as_of_date
                    }
                };
                console.log(cmd);
                CQRS.sendCommand(cmd);
            };

            var getAccountPromise = accountRepository.get({ id: accountId }).$promise;
            getAccountPromise
                .then(function (result) {
                    $scope.account = result;
                    // $scope.account.balance_as_of_date = new Date();
                    $scope.balance_settings.balance = $scope.account.balance;
                    $scope.balance_settings.balance_as_of_date = new Date($scope.account.balance_as_of_date);
                }, function () {

                    $state.go('app.accounts.list', {}, { reload: true });
                });
        }])

    .controller('AccountInterestSettingsCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.interest_settings = {};

            $scope.interest_payment_frequencies = {
                no_interest: "No Interest",
                every_quarter: 'Every Quarter',
                every_month: "Every Month",
                every_week: "Every Week",
                every_fotnight: "Every Fortnight"
            };

            var accountId = $stateParams.id;

            var eventName = "interestSettingsChanged";
            var commandName = "changeInterestSettings";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Account Interest Settings Changed!', 'Account interest settings has been changed');
                $state.go('app.accounts.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: {
                        id: $scope.account.id,
                        interest_payment_frequency: $scope.interest_settings.interest_payment_frequency,
                        interest_rate_per_annum: $scope.interest_settings.interest_rate_per_annum
                    }
                });
            };

            var getAccountPromise = accountRepository.get({ id: accountId }).$promise;
            getAccountPromise
                .then(function (result) {
                    $scope.account = result;
                    $scope.interest_settings.interest_payment_frequency = $scope.account.interest_payment_frequency;
                    $scope.interest_settings.interest_rate_per_annum = $scope.account.interest_rate_per_annum;
                }, function () {

                    $state.go('app.accounts.list', {}, { reload: true });
                });
        }])

    .controller('AccountAlertSettingsCtrl', ['$scope', 'CQRS', 'DenormalizationService', 'accountRepository', '$state', '$stateParams', '$filter', 'toastr', '_',
        function ($scope, CQRS, DenormalizationService, accountRepository, $state, $stateParams, $filter, toastr, _) {

            $scope.alert_settings = {};

            $scope.editing = true;

            var accountId = $stateParams.id;

            var eventName = "alertSettingsChanged";
            var commandName = "changeAlertSettings";

            DenormalizationService.registerDenormalizerFunction({
                viewModelName: $scope.aggregate,
                aggregateType: $scope.aggregate,
                eventName: eventName
            }, function (items, data) {
                toastr.success('Account Alert Settings Changed!', 'Account alert settings has been saved');
                $state.go('app.accounts.list', {}, { reload: true });
            });

            // Submit operation
            $scope.ok = function (form) {

                CQRS.sendCommand({
                    id: _.uniqueId('msg'),
                    command: commandName,
                    aggregate: {
                        name: $scope.aggregate
                    },
                    payload: {
                        id: $scope.account.id,
                        alert_enabled: $scope.alert_settings.alert_enabled,
                        alert_amount: $scope.alert_settings.alert_amount
                    }
                });
            };

            var getAccountPromise = accountRepository.get({ id: accountId }).$promise;
            getAccountPromise
                .then(function (result) {
                    $scope.account = result;
                    $scope.alert_settings.alert_enabled = $scope.account.alert_enabled;
                    $scope.alert_settings.alert_amount = $scope.account.alert_amount;
                }, function () {

                    $state.go('app.accounts.list', {}, { reload: true });
                });
        }]);



