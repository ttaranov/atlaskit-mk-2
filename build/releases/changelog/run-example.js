const changelog = require('./index');
const combo3 = require('./examples/3combo');
const withReleaseSummary = require('./examples/with-release-summary');
const withoutRelease = require('./examples/without-release');
const withoutSummary = require('./examples/without-summary');

changelog(combo3, { prefix: 'combo3-' });
// changelog(withReleaseSummary, { prefix: 'with-release-summary-' });
// changelog(withoutRelease, { prefix: 'without-release-' });
// changelog(withoutSummary, { prefix: 'without-summary-' });
