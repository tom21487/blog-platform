# Stuff to do
1. Learn asynchronous mongodb queries first, because I will be doing a lot of post/tag queries for tag manager
2. Complete tag manager
Links:
- https://stackoverflow.com/questions/47370487/node-js-mongodb-driver-async-await-queries
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
- https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await#:~:text=async%2Fawait%20is%20built%20on%20top%20of%20promises%2C%20so,a%20way%20that%20looks%20like%20simple%20synchronous%20code.
Use Promise.all() (you can use this either with promises or with async - it's really a difference of .then() vs await)
- https://developer.mozilla.org/en-US/docs/web/javascript/reference/global_objects/promise/all
- https://stackoverflow.com/questions/35612428/call-async-await-functions-in-parallel

Asynchronous queries (do this gradually)
Delete images using fs
1. Delete post (done)
2. Error during createController and changeController
3. changeController: remove old post images (if replaced)
Set up .env file to hide mongo uri, jwt secret key
Add multer to controller file by making controller an array of middleware functions
Make sure creating a "not tagged" post works
Use formatName instead of encodeURIComponent
Change control routes to /projects, /blogs instead of /project, /blog
Testing and bug fixes
Bug: create new post with multiple images, then click update post. Then remove the first existing image. The buttons now display numbers, and the wrong image is removed.

Deploy

These are equal:
// Callback
db.collection("test").find(function(err, documents) {
  if (err) return next(err);
  console.log(documents);
});

// Promise
db.collection("test").find()
.then(function(documents) {
  console.log(documents);
})
.catch(function(err) {
  return next(err);
});

// Await
try {
  let documents = await db.collection("test").find();
  console.log(documents);
} catch(err) {
  return next(err);
}