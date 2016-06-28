app.factory('scenarioRepository', [
    '$resource',
    function ($resource) {
        return $resource("api/scenario/:id",
                { id: "@id" },
                {
                    'query': {
                        method: 'GET',
                        url: 'api/scenario'
                    }
                });
    }]);