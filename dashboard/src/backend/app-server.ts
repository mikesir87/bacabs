import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as compression from 'compression';
import * as http from 'http';
import * as path from 'path';

// Angular 2
import { enableProdMode } from '@angular/core';
// Angular 2 Universal
import { createEngine } from 'angular2-express-engine';

// App
import { MainModule } from '../node.module';

// Routes
import { routes } from '../server.routes';

const ROOT = path.join(path.resolve(__dirname, '..'));

export class AppServer {
  app : express.Application;
  server : http.Server;

  static start(port : number) : AppServer {
    if (process.env.NODE_ENV == 'production')
      enableProdMode();

    const server = new AppServer();
    server.server = server.app.listen(port);
    console.log(`Server is now listening to port ${port}`);
    return server;
  }

  constructor() {
    this.app = express();
    this.config();
    this.routeSetup();
  }

  config() {
    // Express View
    this.app.engine('.html', createEngine({ ngModule: MainModule }));
    this.app.set('views', __dirname);
    this.app.set('view engine', 'html');
    this.app.set('json spaces', 2);

    this.app.use(cookieParser('Angular 2 Universal'));
    this.app.use(bodyParser.json());
    this.app.use(compression());

    this.app.use(morgan('dev'));

    function cacheControl(req : express.Request, res : express.Response, next : express.NextFunction) {
      res.header('Cache-Control', 'max-age=60');
      next();
    }

    // Serve static files
    this.app.use('/assets', cacheControl, express.static(path.join(__dirname, '../assets'), {maxAge: 30}));
    this.app.use(cacheControl, express.static(path.join(ROOT, '../dist/client'), {index: false}));
  }

  routeSetup() {
    this.app.get('/', this.ngApp.bind(this));
    routes.forEach(route => {
      this.app.get(`/${route}`, this.ngApp.bind(this));
      this.app.get(`/${route}/*`, this.ngApp.bind(this));
    });

  }

  registerApiRoutes(router : express.Router) {
    this.app.use('/api', router);
  }

  ngApp(req : express.Request, res : express.Response) {
    res.render('../index', {
      req,
      res,
      // time: true, // use this to determine what part of your app is slow only in development
      preboot: false,
      baseUrl: '/',
      requestUrl: req.originalUrl,
      originUrl: `http://localhost:${ this.app.get('port') }`
    });
  }

}
