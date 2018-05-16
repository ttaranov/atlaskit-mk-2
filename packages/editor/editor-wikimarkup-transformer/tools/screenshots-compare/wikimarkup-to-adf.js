require('./patch-window');

const { JSONTransformer } = require('@atlaskit/editor-json-transformer');
const { writeFileSync } = require('fs');
const { WikiMarkupTransformer } = require('../../dist');

const serializer = new JSONTransformer();
const transformer = new WikiMarkupTransformer();

function textToADF(input) {
  const pmNode = transformer.parse(input);
  return serializer.encode(pmNode);
}

const tasks = require(`${__dirname}/assets/tasks.json`);
const output = {};

let total = 0;
let exceptionNum = 0;

Object.keys(tasks).forEach(key => {
  total++;

  try {
    const adf = textToADF(tasks[key]);
    output[key] = adf;
  } catch (ex) {
    exceptionNum++;
    console.log(`Converter throws exception for issue ${key}: ${ex.stack}`);
  }
});

console.log(`Exceptions: ${exceptionNum} out of ${total}`);

const adfFilePath = `${__dirname}/assets/adf.json`;
console.warn(`Write parsed ADF to JSON file ${adfFilePath}`);
writeFileSync(adfFilePath, JSON.stringify(output, null, 2));

process.exit(0);
