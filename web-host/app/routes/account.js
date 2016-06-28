exports.actions = function(app, options, repository) {

    var accountRepo = repository.extend({
        collectionName: 'account'
    });

    app.get('/api/account', function(req, res) { 
        accountRepo.find(function(err, accounts) {
            if (err) {
                return res.send('error', { error: err });
            }

            return res.json({items: accounts});
        });
    });

    app.get('/api/account/:id', function(req, res) { 
        var accountId = req.params.id;
        accountRepo.get(accountId, function(err, account) {
            if (err) {
                return res.send('error', { error: err });
            }

            if(account == null)
            {
                res.statusCode = 404;
                return res.send({ error: 'Something failed!' });
            }

            return res.json(account);
        });
    });
};