exports.actions = function(app, options, repository) {

    var scenarioRepo = repository.extend({
        collectionName: 'scenario'
    });

    app.get('/api/scenario', function(req, res) { 
        scenarioRepo.find(function(err, scenarios) {
            if (err) {
                return res.send('error', { error: err });
            }

            return res.json({items: scenarios});
        });
    });

    app.get('/api/scenario/:id', function(req, res) { 
        var scenarioId = req.params.id;
        scenarioRepo.get(scenarioId, function(err, scenario) {
            if (err) {
                return res.send('error', { error: err });
            }

            if(scenario == null)
            {
                res.statusCode = 404;
                return res.send({ error: 'Something failed!' });
            }

            return res.json(scenario);
        });
    });
};