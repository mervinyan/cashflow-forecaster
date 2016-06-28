app.factory('accountRepository', [
    '$resource',
    function ($resource) {
        return $resource("api/account/:id",
                { id: "@id" },
                {
                    'query': {
                        method: 'GET',
                        url: 'api/account'
                    }
                });
    }]);