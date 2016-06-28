exports.actions = function(app, options, repository) {

    var budgetRepo = repository.extend({
        collectionName: 'budget'
    });

    app.get('/api/budget', function(req, res) { 
        budgetRepo.find(function(err, budgets) {
            if (err) {
                return res.send('error', { error: err });
            }

            return res.json({items: budgets});
        });
    });

    app.get('/api/budget/:id', function(req, res) { 
        var budgetId = req.params.id;
        budgetRepo.get(budgetId, function(err, budget) {
            if (err) {
                return res.send('error', { error: err });
            }

            if(budget == null)
            {
                res.statusCode = 404;
                return res.send({ error: 'Something failed!' });
            }

            return res.json(budget);
        });
    });
};