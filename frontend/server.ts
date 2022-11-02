import 'zone.js/dist/zone-node';
const domino = require('domino');
import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';
import 'localstorage-polyfill';
import { existsSync ,readFileSync } from 'fs';
const distFolder1 = join(process.cwd(), 'dist/sap-world/browser');
const indexHtml1 = existsSync(join(distFolder1, 'index.original.html')) ? 'index.original.html' : 'index.html';
const template = readFileSync(join(distFolder1, indexHtml1)).toString();
const window = domino.createWindow(template.toString());

global['window'] = window;
global['document'] = window.document;
//global['self'] = window
//global['IDBIndex'] = window.IDBIndex
//global['document'] = window.document
global['navigator'] = window.navigator
//global['getComputedStyle'] = window.getComputedStyle;
global['localStorage'] = localStorage;
window.Object = Object;
global['Event'] = null;

import { AppServerModule } from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/sap-world/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  /*server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });*/
  
  // Will do SSR
  /*server.get('/social-share', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });*/
  server.get('/linkedin-share', (req, res) => {
    /*res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });*/
	
	const timeoutAfter = 1000; // timeout after 1s
    const indexFile = join(distFolder, 'index.html');

    let isActive = setTimeout(() => {
      console.error(`TIMEOUT after ${timeoutAfter}ms on `, req.url);
      isActive = null;
      const html = readFileSync(indexFile).toString() + '<!-- data-cy=error-timeout -->';
      res.status(200).send(html);
    }, timeoutAfter)

    res.render(
      indexHtml,
      {
        req,
        res,
      },
      (err: Error, html: string) => {
        if(err) console.error(err);
        if(isActive) {
          clearTimeout(isActive); // clear timeout if response comes first
        } else {
          return; // if timeout, response is already sent
        }

        if(!html) {
          // if there is error, just render index.html, it's better then 500 error
          html = readFileSync(indexFile).toString() + '<!-- data-cy=error -->';
        }
        res.status(200).send(html);
      },
    );
	
  });
  
  // This route will do CSR
 server.get('*', (req, res) => {
    res.sendFile(join(distFolder, 'index.html'));
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
if (mainModule && mainModule.filename === __filename) {
  run();
}


export * from './src/main.server';
