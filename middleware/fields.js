var
  utils = require('../lib/utils')
;

module.exports = function(fields){
  return function(req, res, next){
    var check = [];

    if (req.isOwner && fields.hasOwnProperty('owner')) check = fields.owner.read;
    else check = fields.world.read;

    var
      json = res.json

    , filterDoc = function(doc){
        for (var key in doc){
          if (check.indexOf(key) === -1) delete doc[key];
        }
      }
    ;

    res.json = function(result){
      if (result.error || check.length === 0) return json.apply(res, arguments);

      if (utils.isArray(result.data)){
        for (var i = result.data.length - 1; i >= 0; i--){
          filterDoc(result.data[i]);
        }
      }else{
        filterDoc(result.data);
      }

      json.apply(res, arguments);

      res.json = json;
    };

    next();
  };
};