exports.index = function(req, res, next) {
  res.render('contact', {
    title: 'Tom\'s site - contact',
    page: 'contact',
    language: req.params.language,
  });
}