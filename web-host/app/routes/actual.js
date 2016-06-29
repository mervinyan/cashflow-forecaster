exports.actions = function(app, options, repository) {

    var actualRepo = repository.extend({
        collectionName: 'actual'
    });

    app.get('/api/actual', function(req, res) { 
        actualRepo.find(function(err, actuals) {
            if (err) {
                return res.send('error', { error: err });
            }

            return res.json({items: actuals});
        });
    });

    app.get('/api/actual/:id', function(req, res) { 
        var actualId = req.params.id;
        actualRepo.get(actualId, function(err, actual) {
            if (err) {
                return res.send('error', { error: err });
            }

            if(actual == null)
            {
                res.statusCode = 404;
                return res.send({ error: 'Something failed!' });
            }

            return res.json(actual);
        });
    });
};