exports.actions = function(app, options, repository) {

    var forecastRepo = repository.extend({
        collectionName: 'forecast'
    });

    app.get('/api/forecast', function(req, res) { 
        forecastRepo.find(function(err, forecasts) {
            if (err) {
                return res.send('error', { error: err });
            }

            return res.json({items: forecasts});
        });
    });

    app.get('/api/forecast/:id', function(req, res) { 
        var forecastId = req.params.id;
        forecastRepo.get(forecastId, function(err, forecast) {
            if (err) {
                return res.send('error', { error: err });
            }

            if(forecast == null)
            {
                res.statusCode = 404;
                return res.send({ error: 'Something failed!' });
            }

            return res.json(forecast);
        });
    });
};