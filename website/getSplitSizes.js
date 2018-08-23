//@flow
const stats = require('./dist/stats.json');
const knownSplits = [
  '@atlaskit-internal_editor-core_picker-facade.js',
  '@atlaskit-internal_editor-core-async.js',
  '@atlaskit-internal_media-editor-view.js',
  '@atlaskit-internal_media-viewer-pdf-viewer.js',
];
const longestNameLength = knownSplits.reduce(
  (max, next) => Math.max(max, next.length),
  0,
);
const knownSplitsAssets = stats.assets.filter(stat =>
  knownSplits.includes(stat.name),
);
knownSplitsAssets.forEach(asset => {
  const paddedName = asset.name.padEnd(longestNameLength);
  const sizeInKb = (asset.size / 1000).toFixed(2);
  console.log(`${paddedName} ${sizeInKb} kb`);
});
