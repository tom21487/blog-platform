exports.index = function(req, res, next) {
  res.render('contact', {
      title: req.params.language == 'en' ? 'Contact' : '联系',
    page: 'contact',
    language: req.params.language,
  });
}
