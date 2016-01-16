/**
 * All of our Routes are defined here
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


// GET Route for all posts
router.get('/posts', function(req, res, next){
  Post.find(function(err, posts){
    if(err) { return next(err); }

    res.json(posts);
  });
});

// POST Route for a new post
router.post('/posts', function(req, res, next){
  var post = new Post(req.body);

  post.save(function(err,post){
    if(err) {return next(err);}

    res.json(post);
  });
});



// Whenever posts are detected within parameters, they will be loaded from db
router.param('post', function(req,res,next,id) {
  var query = Post.findById(id);

  query.exec(function(err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error("can't find post")); }

    req.post = post;
    return next();
  });

});

// Whenever comments are detected within parameters, they will be loaded from db
router.param('comment', function(req,res,next,id) {
  var query = Comment.findById(id);

  query.exec(function(err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error("can't find comment")); }

    req.comment = comment;
    return next();
  });
});

// GET Route gets specific post information by id
router.get('/posts/:post', function(req, res, next) {

  //loads all comments for specific post
  req.post.populate('comments', function(err,post){
    res.json(post);
  });


});

//PUT Request to update upvote for post. Remember it is at 0 as a default unless otherwise adjusted
router.put('/posts/:post/upvote', function(req,res,next){
  req.post.upvote(function(err,post){
    if(err) { return next(err); }

    res.json(post);
  })
});


//PUT Request to update upvote. Remember it is at 0 as a default unless otherwise adjusted
router.post('/posts/:post/comments', function(req,res,next){
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err,comment){
    if(err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if(err) { return next(err); }

      res.json(comment);
    })
  });
});

//PUT Request to update upvote for comment. Remember it is at 0 as a default unless otherwise adjusted
router.put('/posts/:post/comments/:comment/upvote', function(req,res,next){
  req.comment.upvote(function(err,comment){
    if(err) { return next(err); }

    res.json(comment);
  });
});

module.exports = router;
