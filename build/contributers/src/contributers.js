// @flow
const spawn = require('child_process').spawn;

const gitExec = (command /* : Array<string> */ /*: Promise<string> */) =>
  new Promise((resolve, reject) => {
    const thread = spawn('git', command, {
      stdio: ['inherit', 'pipe', 'pipe'],
    });
    const stdOut = [];
    const stdErr = [];

    thread.stdout.on('data', data => {
      stdOut.push(data.toString('utf8'));
    });

    thread.stderr.on('data', data => {
      stdErr.push(data.toString('utf8'));
    });

    thread.on('close', () => {
      if (stdErr.length) {
        reject(stdErr.join(''));
        return;
      }
      resolve(stdOut.join());
    });
  });

module.exports = gitExec;
