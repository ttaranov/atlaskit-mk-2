import React from 'react';
import { getParameters } from 'codesandbox/lib/api/define';

const code = `import React from 'react';
import ReactDOM from 'react-dom';

function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const user = {
  firstName: 'Harper',
  lastName: 'Meck',
};

const element = (
  <h1>
    Hello, {formatName(user)}!
  </h1>
);

ReactDOM.render(
  element,
  document.getElementById('root')
);`;
const html =
  '<div id="root"></div><script type="text/javascript" src="index.js"></script>';

const parameters = getParameters({
  files: {
    'package.json': {
      content: {
        dependencies: {
          react: 'latest',
          'react-dom': 'latest',
        },
      },
    },
    'sandbox.config.json': {
      content: JSON.stringify({
        template: 'parcel',
      }),
    },
    'index.js': {
      content: code,
    },
    'index.html': {
      content: html,
    },
  },
});

const makeFetch = () => {
  let formData = new FormData();
  formData.append('parameters', parameters);
  console.log('click called', formData);
  fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
    method: 'post',
    body: formData,
  })
    .then(a => a.json())
    .then(a => console.log('result returned', a))
    .catch(e => console.warn('error', e));
};

export default () => <button onClick={makeFetch}>Fetch data</button>;
