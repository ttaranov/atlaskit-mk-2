const createChangeset = require('../../changeset/createChangeset')



createChangeset(['pkg-a'], { cwd: process.cwd() })
  .then(console.log)
