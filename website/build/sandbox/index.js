const fs = require('fs-extra');
const globby = require('globby');
const path = require('path');
const { spawn } = require('child_process');
const moveSandboxFiles = require('./moveSandboxFiles');

const packagesDir = path.join(process.cwd(), '..', 'packages');

const isDirectory = filepath => fs.lstatSync(filepath).isDirectory();

// Read the packages directory
fs
  .readdirSync(packagesDir)
  // Ignore utils
  .filter(dir => dir !== 'utils')
  // Get the absolute path
  .map(dir => path.join(packagesDir, dir))
  // Just get team directories
  .filter(isDirectory)
  .forEach(team =>
    // Get the component packages under this team
    fs
      .readdirSync(team)
      // Filter out anything that isn't a directory
      .filter(dir => isDirectory(path.join(team, dir)))
      .forEach(component =>
        // Get all the examples files
        globby
          .sync(path.join(path.join(team, component), 'examples', '*.js'))
          // Just get the filename
          .map(filepath => path.parse(filepath).name)
          // Filter anything that doesn't start with a number
          // Examples should be named `0-name.js`
          .filter(filename => filename.match(/^\d/))
          // Copy example files and dependents to the website's dist directory
          .forEach(example => moveSandboxFiles(component, example)),
      ),
  );
