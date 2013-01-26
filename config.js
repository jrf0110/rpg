var config = {
  dev: {
    mongoConnStr: "mongodb://127.0.0.1:27017/rpg"
  , cookieSecret: "T3xt!RpG0hsN4P!!"
  , passwordSalt: "T3xt!RpG0hsN4P!!"
  , passwordSaltLength: 10
  , validationOptions: {
      singleError: false
    }

  , characterClasses: [
      'warrior'
    ]
  }
, production: {

  }
};

module.exports = config[process.env.mode || 'dev'];