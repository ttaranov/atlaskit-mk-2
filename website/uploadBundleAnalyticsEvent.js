const stats = require('./dist/stats.json');
const AnalyticsClient = require('./AnalyticsClient');

const knownSplits = [
  '@atlaskit-internal_editor-core_picker-facade.js',
  '@atlaskit-internal_editor-core-async.js',
  '@atlaskit-internal_media-editor-view.js',
  '@atlaskit-internal_media-viewer-pdf-viewer.js',
];

const knownSplitsAssets = stats.assets.filter(asset =>
  knownSplits.includes(stat.name),
);

knownSplitsAssets.forEach(asset => {
  const paddedName = asset.name.padEnd(20);
  const sizeInKb = (asset.size / 1000).toFixed(2);
  console.log(`${paddedName} ${sizeInKb} kb`);
});
