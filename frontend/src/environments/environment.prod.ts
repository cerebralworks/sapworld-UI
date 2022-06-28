let host = window.location.host;
let hostName = host.split(':');
const baseUrl = `${window.location.protocol}//${hostName[0]}`;
const baseAdminUrl = `${window.location.protocol}//admin.${hostName[0]}`;
console.log(baseUrl);

export const environment = {
  production: true,
  calenderUrl: 'https://api.calendly.com/organizations/',
  webhookUrl: 'https://api.calendly.com/webhook_subscriptions',
  membershipUrl: 'https://api.calendly.com/organization_memberships',
  eventUrl: 'https://api.calendly.com/event_types',
  adminEmail : 'sapworldprod@gmail.com',
  serverUrl:`${baseUrl}:5002`,
  apiUrl:`${baseUrl}:1339`,
  adminUrl: `${baseAdminUrl}`,
  envName: 'PROD',
  API_URL: 'assets/api',
  clientUrl: `${baseUrl}`
};
