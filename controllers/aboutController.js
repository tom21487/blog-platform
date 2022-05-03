exports.index = function(req, res, next) {
  res.render('about', {
      title: req.params.language == 'en' ? 'About' : '关于',
    page: 'about',
    language: req.params.language
  });
}
