app.factory('budgetRepository', [
    '$resource',
    function ($resource) {
        return $resource("api/budget/:id",
                { id: "@id" },
                {
                    'query': {
                        method: 'GET',
                        url: 'api/budget'
                    }
                });
    }]);