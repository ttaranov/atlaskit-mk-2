const Enquirer = require('enquirer');
const enquirerPrompts = require('enquirer-prompts');
const uuid = require('uuid/v1');

const enquirer = new Enquirer();
// These are the enquirer plugins for things like confirm, radio, editor, etc
enquirer.use(enquirerPrompts);

async function askQuestion(prompt) {
  const questionKey = `Question-${uuid()}`;
  enquirer.question(questionKey, prompt);

  return enquirer.ask(questionKey)
    .then(responses => responses[questionKey]);
}

async function askConfirm(prompt) {
  // need a random key so we dont conflict with other questions
  const questionKey = `Confirm-${uuid()}`;
  enquirer.question(questionKey, prompt, { type: 'confirm' });
  // the response we get back contains all of the responses to all questions we've asked, so just
  return enquirer.ask(questionKey)
    .then(responses => responses[questionKey]);
}

async function askList(prompt, choices) {
  const questionKey = `List-${uuid()}`;
  enquirer.question(questionKey, prompt, { type: 'list', choices });

  return enquirer.ask(questionKey)
    .then(responses => responses[questionKey]);
}

async function askCheckbox(prompt, choices) {
  const questionKey = `Checkbox-${uuid()}`;
  enquirer.question(questionKey, prompt, { type: 'checkbox', choices });

  return enquirer.ask(questionKey)
    .then(responses => responses[questionKey]);
}

module.exports = {
  askQuestion,
  askConfirm,
  askList,
  askCheckbox,
};
