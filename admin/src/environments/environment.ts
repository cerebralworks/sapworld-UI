// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { env } from 'process';
let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
const port = hostName[1];

export const environment = {
  production: false,
  serverUrl: 'http://localhost:5000',
  envName: 'DEV',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}:${port}`,
  appVersion: 'v717demo1',
  USERDATA_KEY: 'authf649fc9a5f55',
  isMockEnabled: true,
  apiUrl: 'api'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
