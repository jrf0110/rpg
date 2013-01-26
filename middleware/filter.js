module.exports = function(model){
  return function(req, res, next){
    for (var key in req.body){
      if (!model.properties.hasOwnProperty(key)) delete req.body[key];
    }
    next();
  };
};