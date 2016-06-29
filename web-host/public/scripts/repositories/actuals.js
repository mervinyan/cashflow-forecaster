app.factory('actualRepository', [
    '$resource',
    function ($resource) {
        return $resource("api/actual/:id",
                { id: "@id" },
                {
                    'query': {
                        method: 'GET',
                        url: 'api/actual'
                    }
                });
    }]);