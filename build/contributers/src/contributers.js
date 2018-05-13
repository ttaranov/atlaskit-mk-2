'use strict';
// const bolt = require('bolt');
// // const { spawn } = require('child_process');
// //const crossSpawn = require('spawndamnit');
// const spawn = require('spawndamnit');
//
// module.exports = async () => {
//   const workspaces = await bolt.getWorkspaces();
//
//   let child = await spawn('git', ['shortlog', '-n', '-s', '-e']);
//
//   child.on('stdout', data => console.log(data.toString()));
//   child.on('stderr', data => console.error(data.toString()));
//
//   let { code, stdout, stderr } = await child;
//
//   console.log(code === 0 ? 'success' : 'error');
// }

const spawn = require('child_process').spawn;

const gitExec = command =>
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
