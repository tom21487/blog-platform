exports.index = function(req, res, next) {
  res.render('user', {
    title: 'Tom\'s site - user'
  });
}