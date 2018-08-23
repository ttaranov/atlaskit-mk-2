/* Based on Scott's implementation here:  https://bitbucket.org/atlassian/editor-performance/src/master/bin/measure/analytics.js */
const fetch = require('node-fetch');
const Table = require('tty-table');

class AnalyticsClient {
  constructor(options) {
    this.package = options.package;
    this.version = options.version;
    this.payload = [];
  }

  addEvent(eventName, properties = {}) {
    if (Object.values(properties).some(value => typeof value === 'object')) {
      console.warn('Analytic properties are expected to be a flat JSON object');
    }
    this.payload.push({ name: eventName, properties });
    return this;
  }

  send() {
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
          server: 'dev',
          product: 'atlaskit',
          subproduct: this.package,
          version: this.version,
          user: '-',
          serverTime: Date.now(),
        })),
      }),
    });
  }

  displayTable() {
    const rows = [];
    this.payload.forEach(event => {
      const properties = Object.keys(event.properties)
        .map(key => `${key}: ${event.properties[key]}`)
        .join(', ');
      rows.push([this.package, this.version, event.name, properties]);
    });
    const eventTable = new Table(
      [
        { value: 'Package' },
        { value: 'Version' },
        { value: 'Name' },
        { value: 'Properties', width: 100 },
      ],
      rows,
    );
    console.log(eventTable.render());
  }
}

module.exports = AnalyticsClient;
