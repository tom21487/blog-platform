exports.index = function(req, res, next) {
  res.render('about', {
    title: 'Tom\'s site - about',
    page: 'about',
    language: req.params.language
  });
}