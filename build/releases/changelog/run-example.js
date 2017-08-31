const { updateChangeLog } = require('./index');
const combo3 = require('./examples/3combo');
const withReleaseSummary = require('./examples/with-release-summary');
const withoutRelease = require('./examples/without-release');
const withoutSummary = require('./examples/without-summary');

updateChangeLog(combo3, { prefix: 'combo3-' });
updateChangeLog(withReleaseSummary, { prefix: 'with-release-summary-' });
updateChangeLog(withoutRelease, { prefix: 'without-release-' });
updateChangeLog(withoutSummary, { prefix: 'without-summary-' });
