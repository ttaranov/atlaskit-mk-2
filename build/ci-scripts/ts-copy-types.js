const {
  getPackagesInfo,
  TOOL_NAME_TO_FILTERS,
} = require('@atlaskit/build-utils/tools');
const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const utils = require('util');

const BASE_DIR = path.resolve(__dirname, '..', '..');
const TS_GEN_DIR = path.resolve(BASE_DIR, 'ts-gen');

(async () => {
  const packages = await getPackagesInfo(process.cwd());
  const dirsToLink = packages
    .filter(pkg => TOOL_NAME_TO_FILTERS.typescript(pkg))
    .map(pkg => pkg.relativeDir);

  for (const dir of dirsToLink) {
    const relativeNonPackageDir = dir.replace(/^packages\//g, '');
    const typeDir = path.resolve(TS_GEN_DIR, relativeNonPackageDir, 'src');
    const packageDir = path.resolve(BASE_DIR, dir);
    const targetDir = path.resolve(packageDir, 'dist', 'es5');

    await fs.mkdirp(targetDir);
    await fs.copy(typeDir, targetDir);

    const files = await utils.promisify(glob)(
      path.resolve(targetDir, '**', '*.d.ts'),
    );
    for (const file of files) {
      const content = await fs.readFile(file, 'utf8');
      await fs.writeFile(
        file,
        content
          .replace(/import\("\.\..+?node_modules\//gim, 'import("')
          .replace(
            /import\("(@atlaskit\/[^\/]+)\/src\/(.+?)"\)/gim,
            'import("$1/dist/es5/$2")',
          ),
      );
    }
  }
})().catch(err => {
  console.error('An error occurred while copying types:', err);
  process.exit(1);
});
