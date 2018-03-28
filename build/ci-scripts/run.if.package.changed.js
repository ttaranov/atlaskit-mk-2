// @flow
const { getChangedPackagesSinceMaster } = require('../utils/packages');
const spawndamnit = require('spawndamnit');

/**
 * This is a helper to run a script if a certaing package changed.
 * It works by returning a zero code if a tool should be run, so that the normal usage becomes:
 *
 * `node build/ci-scripts/run.tool.if.needed.js @full/package-name -- yarn toolName`.
 */
(async () => {
  let cwd = process.cwd();
  let args = process.argv.slice(2);

  let dashdashIndex = args.indexOf('--');
  let command = args.slice(dashdashIndex + 1);
  let packageNames = args.slice(0, dashdashIndex);

  if (dashdashIndex < 0 || command.length === 0 || packageNames.length === 0) {
    console.error('Incorrect usage, run it like this:\n');
    console.error(
      '  $ node build/ci-scripts/run.if.package.changed.js [...packages] -- <...command>\n',
    );
    process.exit(1);
  }

  let changedPackages = await getChangedPackagesSinceMaster();
  let matched = !!changedPackages.find(pkg => packageNames.includes(pkg.name));

  if (!matched) {
    process.exit(0);
  }

  try {
    let res = await spawndamnit(command[0], command.slice(1), {
      stdio: 'inherit',
      tty: (process.stdout && process.stdout.isTTY) || false,
    });

    throw process.exit(res.code);
  } catch (err) {
    if (err instanceof spawndamnit.ChildProcessError) {
      process.exit(err.code);
    } else {
      process.exit(1);
    }
  }
})();
