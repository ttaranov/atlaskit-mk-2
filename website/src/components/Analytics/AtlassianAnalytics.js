class AtlassianAnalyticsClient {
  static request(options) {
    return new AtlassianAnalyticsClient(options);
  }

  constructor(options) {
    this.payload = [];
    this.version = options.version;
    this.location = options.location;
  }

  add(eventName, properties = {}) {
    if (
      Object.values(properties).some(key => typeof properties[key] === 'object')
    ) {
      console.warn('Analytic properties are expected to be a flat JSON object');
    }
    this.payload.push({ name: eventName, properties });
    return this.payload;
  }

  async send() {
    return fetch('https://analytics.atlassian.com/analytics/events', {
      method: 'POST',
      headers: {
        Accept: 'application/json, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: this.payload.map(event => ({
          name: event.name,
          properties: event.properties,
          server: location.host === 'atlaskit.atlassian.com' ? 'prod' : 'dev', // Make this prod later
          product: 'atlaskit',
          subproduct: 'website',
          version: this.version,
          user: '-',
          serverTime: Date.now(),
        })),
      }),
    });
  }
}

module.exports = AtlassianAnalyticsClient;
