let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  calenderUrl: 'https://api.calendly.com/organizations/',
  webhookUrl: 'https://api.calendly.com/webhook_subscriptions',
  serverUrl: 'http://65.0.146.153:5000',
  adminUrl: 'http://65.0.146.153/admin',
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
