exports.actions = function(app, options, repository) {
	require('./routes/category').actions(app, options, repository);
	require('./routes/product').actions(app, options, repository);
	require('./routes/order').actions(app, options, repository);
	require('./routes/account').actions(app, options, repository);
	require('./routes/scenario').actions(app, options, repository);
	require('./routes/budget').actions(app, options, repository);
	require('./routes/forecast').actions(app, options, repository);
	require('./routes/actual').actions(app, options, repository);
};