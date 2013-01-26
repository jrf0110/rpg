module.exports = function(ownershipTest){
  return function(req, res, next){
    ownershipTest(req, res, function(error, isOwner){
      if (error) return res.json({ error: error, data: null });

      req.isOwner = isOwner;

      next();
    });
  };
};