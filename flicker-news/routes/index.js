/**
 * All of our Routes are defined here
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');


// auth
var passport = require('passport');
var jwt = require('express-jwt');
var auth = jwt({ secret: 'SECRET', userProperty: 'payload'});


// GET home page
router.get('/', function(req, res) {
  res.render('../public/index', { title: 'Express' });
});


// GET Route for all posts
router.get('/posts', function(req, res, next){
  Post.find(function(err, posts){
    if(err) { return next(err); }

    res.json(posts);
  });
});

// POST Route for a new post
router.post('/posts', auth, function(req, res, next){
  var post = new Post(req.body);
  post.author = req.payload.username;

  post.save(function(err,post){
    if(err) {return next(err);}

    res.json(post);
  });
});



// Whenever posts are detected within parameters, they will be loaded from db
// Preloads post objects on routes with ':post'
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
router.put('/posts/:post/upvote', auth, function(req,res,next){
  req.post.upvote(function(err,post){
    if(err) { return next(err); }

    res.json(post);
  });
});

//PUT Request to update downvote for post. Remember it is at 0 as a default unless otherwise adjusted
router.put('/posts/:post/upvote', auth, function(req,res,next){
  req.post.downvote(function(err,post){
    if(err) { return next(err); }

    res.json(post);
  });
});


//POST request to create a new comment
router.post('/posts/:post/comments', auth, function(req,res,next){
  var comment = new Comment(req.body);
  comment.post = req.post;
  comment.author = req.payload.username;

  comment.save(function(err,comment){
    if(err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post){
      if(err) { return next(err); }

      res.json(comment);
    });
  });
});

//PUT Request to update upvote for comment. Remember it is at 0 as a default unless otherwise adjusted
router.put('/posts/:post/comments/:comment/upvote', auth, function(req,res,next){
  req.comment.upvoteComment(function(err,comment){
    if(err) { return next(err); }

    res.json(comment);
  });
});

//PUT Request to update downvoting for comment. Remember it is at 0 as a default unless otherwise adjusted
router.put('/posts/:post/comments/:comment/upvote', auth, function(req,res,next){
  req.comment.downvoteComment(function(err,comment){
    if(err) { return next(err); }

    res.json(comment);
  });
});



//POST Request for logging in user
router.post('/login', function(req, res, next){

  // requires user to enter valid username & password
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

//POST Request for registration user and password
router.post('/register', function(req, res, next){

  // requires user to enter valid username & password
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();


  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

module.exports = router;
