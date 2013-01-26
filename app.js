
/**
 * Module dependencies.
 */

var
  express     = require('express')
, http        = require('http')
, path        = require('path')
, MongoStore  = require('connect-mongo')(express)

, routes      = require('./routes')
, config      = require('./config')
, m           = require('./middleware')

, app         = express()
;

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.cookieSecret
  , store: new MongoStore({
      url: config.mongoConnStr
    })
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Session

app.get(
  '/session'
, routes.session.get
);

// Convenience
app.get(
  '/session/destroy'
, routes.session.del
);

app.del(
  '/session'
, routes.session.del
);

app.post(
  '/session'
, routes.session.create
);

// Users

app.get(
  '/users'
, m.fields(routes.users.fields)
, routes.users.list
);

app.get(
  '/users/:userId'
, m.owner(routes.users.ownership)
, m.fields(routes.users.fields)
, routes.users.get
);

app.del(
  '/users/:userId'
, m.owner(routes.users.ownership)
, routes.users.del
);

app.post(
  '/users'
, m.filter(routes.users.model)
, m.fields(routes.users.fields)
, routes.users.create
);

app.patch(
  '/users/:userId'
, m.filter(routes.users.model)
, m.owner(routes.users.ownership)
, m.fields(routes.users.fields)
, routes.users.update
);

// Characters

app.get(
  '/characters'
, m.fields(routes.characters.fields)
, routes.characters.list
);

app.get(
  '/characters/:characterId'
, m.owner(routes.characters.ownership)
, m.fields(routes.characters.fields)
, routes.characters.get
);

app.del(
  '/characters/:characterId'
, m.owner(routes.characters.ownership)
, routes.characters.del
);

app.post(
  '/characters'
, m.filter(routes.characters.model)
, m.fields(routes.characters.fields)
, routes.characters.create
);

app.patch(
  '/characters/:characterId'
, m.filter(routes.characters.model)
, m.owner(routes.characters.ownership)
, m.fields(routes.characters.fields)
, routes.characters.update
);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
