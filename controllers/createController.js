exports.index = function(req, res, next) {
  res.render('create_form', {
    title: 'Create new post',
    page: 'home'
  });
}