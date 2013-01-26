var
  utils     = require('../lib/utils')
, Db        = require('../lib/mongo-wrapper')
, errors    = require('../lib/errors')

, resources = {
    users:    require('./users')
  }

, db = {
    users:      new Db('users')
  , characters: new Db('characters')
  }
;

module.exports.get = function(req, res){
  res.json({ error: null, data: req.session.user });
};

module.exports.create = function(req, res){
  var stage = {
    start: function(){
      stage.lookUpUser();
    }

  , lookUpUser: function(){
      db.users.findOne({ email: req.body.email }, function(error, user){
        if (error) return stage.error(error);

        if (!user) return stage.error(errors.auth.INVALID_EMAIL);

        utils.comparePasswords(req.body.password, user.password, function(error, success){
          if (error) return stage.error(error);

          delete user.password;

          if (success) return stage.lookUpCharacters(user);

          return stage.error(errors.auth.INVALID_PASSWORD);
        });
      });
    }

  , lookUpCharacters: function(user){
      db.characters.find({ userId: user._id.toString() }, { fields: { _id: 1 } }, function(error, characters){
        if (error) return stage.error(error);
        user.characters = characters.map(function(c){ return c._id; });
        stage.userLoginSuccess(user);
      });
    }

  , userLoginSuccess: function(user){
      req.session.user = user;
      res.json({ error: null, data: user });
    }

  , error: function(error){
      return console.log(error), res.json({ error: error, data: null })
    }
  };

  stage.start();
};

module.exports.del = function(req, res){
  delete req.session.user;
  res.json({ error: null, data: null });
};