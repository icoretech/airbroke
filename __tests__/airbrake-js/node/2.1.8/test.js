const { Notifier } = require('@airbrake/node');

const airbrake = new Notifier({
  projectId: 1,
  projectKey: 'REPLACE_ME',
  environment: 'production',
  host: process.env.AIRBROKE_URL,
  remoteConfig: false,
});

try {
  throw new Error('Hello from Airbrake!');
} catch (err) {
  airbrake.notify(err);
}
