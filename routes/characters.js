var
  utils   = require('../lib/utils')
, config  = require('../config')
, Db      = require('../lib/mongo-wrapper')

, model = {
    type: 'object'
  , properties: {
      name: {
        type: "string"
      , minLength: 5
      , pattern: /^[a-z0-9]*$/i
      }
    , userId: {
        type: "String"
      }
    , class: {
        type: "string"
      , enum: config.characterClasses
      }
    , position: {
        type: "object"
      , properties: {
          x: { type: "Number" }
        , y: { type: "Number" }
        }
      }
    }
  }

, db = {
    users:      new Db('users')
  , characters: new Db('characters')
  }
;

module.exports.fields = {
  world: {
    read: ['_id', 'name', 'class']
  }
, owner: {
    read: ['_id', 'userId', 'name', 'class', 'position']
  }
};

module.exports.model = model;

module.exports.ownership = function(req, res, next){
  next(null
  , req.session
  && req.session.user
  && req.session.user.characters.indexOf(req.param('characterId')) > -1
  );
};

module.exports.list = function(req, res){
  db.characters.find(function(error, characters){
    if (error) console.error(error);
    res.json({ error: error, data: characters });
  });
};

module.exports.get = function(req, res){
  db.characters.findOne(req.param('characterId'), { fields: {} }, function(error, character){
    res.json({ error: error, data: character });
  });
};

module.exports.create = function(req, res){
  req.body.userId = req.session.user._id;
  req.body.position = { x: 0, y: 0 };
  req.body.health = 100;

  db.characters.save(req.body, function(error, character){
    if (error) return res.json({ error: error, data: null });

    req.session.user.characters.push(character._id);

    res.json({ error: null, data: character });
  });
};

module.exports.update = function(req, res){
  var $set = {}, $inc = {};

  if (req.param('move-x') > 0) $inc["position.x"] = 1;
  if (req.param('move-x') < 0) $inc["position.x"] = -1;

  if (req.param('move-y') > 0) $inc["position.y"] = 1;
  if (req.param('move-y') < 0) $inc["position.y"] = -1;

  db.characters.findAndModify(req.param('characterId'), [], { $inc: $inc }, function(error, character){
    res.json({ error: error, data: character });
  });
};

module.exports.del = function(req, res){
  db.characters.remove(req.param('userId'), function(error){
    res.json({ error: error, data: null });
  });
};