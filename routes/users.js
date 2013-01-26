var
  utils = require('../lib/utils')
, Db    = require('../lib/mongo-wrapper')

, model = {
    type: 'object'
  , properties: {
      alias: {
       type: "string"
      , minLength: 5
      , pattern: /^[a-z0-9\_]*$/i
      }
    , email: {
       type: "string"
      , minLength: 3
      , pattern: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      }
    , password: {
       type: "string"
      }
    }
  }

, db = {
    users: new Db('users')
  }
;

module.exports.fields = {
  world: {
    read: ['alias', '_id']
  }
, owner: {
    read: ['alias', 'email', '_id']
  }
};

module.exports.model = model;

module.exports.ownership = function(req, res, next){
  next(null, req.session && req.session.user && req.session.user._id === req.param('userId'));
};

module.exports.list = function(req, res){
  db.users.find(function(error, users){
    if (error) console.error(error);
    res.json({ error: error, data: users });
  });
};

module.exports.get = function(req, res){
  db.users.findOne(req.param('userId'), { fields: {} }, function(error, user){
    res.json({ error: error, data: user });
  });
};

module.exports.create = function(req, res){
  var stage = {
    start: function(){
      stage.encryptPassword();
    }

  , encryptPassword: function(){
      utils.encryptPassword(req.body.password, function(error, password){
        if (error) return stage.error(error);

        req.body.password = password;

        stage.saveUser();
      });
    }

  , saveUser: function(){
      db.users.save(req.body, function(error){
        res.json({ error: error, data: null });
      });
    }

  , error: function(error){
      return res.json({ error: error, data: null });
    }
  };

  stage.start();
};

module.exports.update = function(req, res){
  var $set = {};
  for (var key in req.body){
    $set[key] = req.body[key];
  }

  db.users.save(req.param('userId'), { $set: $set }, function(error){
    res.json({ error: error, data: null });
  });
};

module.exports.del = function(req, res){
  db.users.remove(req.param('userId'), function(error){
    res.json({ error: error, data: null });
  });
};