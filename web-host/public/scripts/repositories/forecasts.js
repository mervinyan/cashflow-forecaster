app.factory('forecastRepository', [
    '$resource',
    function ($resource) {
        return $resource("api/forecast/:id",
                { id: "@id" },
                {
                    'query': {
                        method: 'GET',
                        url: 'api/forecast'
                    }
                });
    }]);