const packages = require('../utils/packages');
const { getPackagesWithKarmaTests } = require('../karma-config');
/**
 * This is a helper script to return whether or not a certain tool should be run.
 * It works by returning a zero code if a tool should be run, so that the normal usage becomes:
 * `(node build/ci-scripts should.run.js toolName) || yarn toolName`.
 * We use a zero code becaues of a nice side effect of the way that pipelines runs steps.
 * It you have `scriptA && scriptB` and scriptA fails, it will not run scriptB but also, will not
 * fail the whole build as you might expect.
 *
 * For this reason, you should not use this script outside of Pipelines as it likely will not work
 * (when a tool should not run, you'll get a non-zero code which will likely bubble up in other
 * contexts)
 *
 * Each tool announces below which directories it is concerned with below.
 */
(async () => {
  const args = process.argv.slice(2);
  const packagesWithKarmaTests = await getPackagesWithKarmaTests();
  const toolsToDirsMap = {
    flow: [
      'packages/elements/',
      'packages/utils/',
      'build/',
      'website/',
      'patterns/',
    ],
    eslint: [
      'packages/elements/',
      'packages/utils/',
      'build/',
      'website/',
      'patterns/',
    ],
    tslint: ['packages/fabric/', 'build/tslint-rules/'],
    tsc: ['packages/fabric/'],
    browserstack: [...packagesWithKarmaTests, 'build/karma-config/'],
  };

  if (args.length !== 1) {
    console.error('No toolName provided');
    console.error(
      'Usage: `(node build/ci-scripts/should.run.js toolName) && cmdToRun`',
    );
    // There is an obvious issue here in that returning with a non-zero exit code will not fail a
    // build. For now I'm happy to let it just log the warning and keep going. I don't expect there
    // to be any new usages of this script in the future. If we ever needed more safety, we could
    // always make a ci-scripts/fail-current-build.js script
    process.exit(1);
  }
  if (Object.keys(toolsToDirsMap).indexOf(args[0]) === -1) {
    console.error('Unknown toolName: ', args[0]);
    console.error('If you are seeing this erorr, something is very wrong.');
    // Same issue as above
    process.exit(1);
  }
  const changedPackages = await packages.getChangedPackagesSinceMaster();
  // returns true if a certain pkgDir should trigger a toolName
  const shouldRunTool = (pkgDir, toolName) =>
    toolsToDirsMap[toolName].some(toolDir => pkgDir.startsWith(toolDir));

  const codeToReturn = changedPackages.some(pkg =>
    shouldRunTool(pkg.relativeDir, args[0]),
  )
    ? 0
    : 1;

  console.log(
    'Changed packages: ',
    changedPackages.map(pkg => pkg.relativeDir),
  );
  console.log(`Should run ${args[0]}`, codeToReturn === 0 ? 'True' : 'False');
  process.exit(codeToReturn);
})();
