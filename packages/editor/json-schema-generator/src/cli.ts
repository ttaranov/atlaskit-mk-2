import * as meow from 'meow';
import app from './';

const cli = meow(
  `
  Usage
    $ json-schema-generator <input>

  Options
    --stage=0 Include stage 0 nodes/marks/attributes

  Examples
    $ json-schema-generator path/to/ts-definitions --stage=0
`,
  {
    flags: {
      stage: {
        type: 'number',
      },
    },
  },
);

app(cli.input[0], cli.flags);
