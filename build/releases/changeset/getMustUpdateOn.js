// @flow
const bolt = require('bolt');

/*::
type releaseType = {
  name: string,
  type: string,
}
type dependentType = {
  name: string,
  type?: string,
  dependencies: Array<string>,
  finalised?: boolean
}
type changesetType = {
  summary: string,
  releases: Array<releaseType>,
  dependents: Array<dependentType>,
  releaseNotes?: any,
}
type workspaceType = {
  config: {
    dependencies?: {},
    devDependencies?: {},
    peerDependencies?: {},
    bundledDependencies?: {},
    optionalDependencies?: {},
  },
  name: string
}
*/

// Given a dependent and a dependency, returns which kind of updates on the dependency should
// trigger a bump and which symbol it should bump with.
// This is slightly complicated by caret versions when in 0.x ranges. The rules for when to bump are
// Exact match: must always bump
// Tilde range: bumps on major or minor changes
// Caret range: Bumps on major ranges OR always if the current version is 0.x
function getMustUpdateOn(
  allWorkSpaces /*: Array<workspaceType> */,
  dependent /*: dependentType */,
  nextDependency /*: string */,
) {
  const workspace = allWorkSpaces.find(ws => ws.name === dependent.name);
  if (!workspace)
    throw new Error(
      `updating failed, no package found, ${dependent.name}, ${nextDependency}`,
    );
  const pkg = workspace.config;
  const DEPENDENCY_TYPES = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'bundledDependencies',
    'optionalDependencies',
  ];
  let allDependencies = new Map();

  for (let type of DEPENDENCY_TYPES) {
    let deps = pkg[type];
    if (!deps) continue;

    for (let name of Object.keys(deps)) {
      allDependencies.set(name, deps[name]);
    }
  }

  const range = allDependencies.get(nextDependency);
  if (!range)
    throw new Error(
      `conflicting messages around whether ${nextDependency} is depended on by ${
        dependent.name
      }`,
    );

  // matching optional (^ or ~) then three numbers (we capture the symbol and the major number)
  const match = range.match(/^([\^~])?(\d+)\.\d+\.\d+$/);

  if (!match) {
    throw new Error(
      `Internal dependency "${nextDependency}" for "${
        dependent.name
      }" has an invalid range, "${range}"`,
    );
  }

  const [wholeMatch, symbol, majorVersion] = match;

  if (wholeMatch !== range) {
    throw new Error(
      `Invalid version range for internal dependency  ${nextDependency} in workspace ${
        dependent.name
      } , ${range}. Only caret, tilde or exact semver ranges are accepted.`,
    );
  }
  // See comment at the bottom of this file as to why this logic works
  if (symbol === '^') {
    if (majorVersion === '0') {
      return {
        symbol,
        mustUpdateOn: ['major', 'minor', 'patch'],
      };
    }
    return {
      symbol,
      mustUpdateOn: ['major'],
    };
  }
  if (symbol === '~') {
    return {
      symbol,
      mustUpdateOn: ['major', 'minor'],
    };
  }
  // must have pinned dependency
  return {
    symbol,
    mustUpdateOn: ['major', 'minor', 'patch'],
  };
}

module.exports = getMustUpdateOn;

/*
   The logic for mustUpdateOn can be a little confusing because of the way caret dependencies
   are handled. The list below illustrates why this logic is the way it is, by looking at which
   types of changes will lead to us leaving a version range.

// When dependency is an Exact range ( we should always bump)
> satisfies('2.0.0', '1.0.0')
false
> satisfies('1.0.0', '0.0.0')
false

> satisfies('1.1.0', '1.0.0')
false
> satisfies('0.1.0', '0.0.0')
false

> satisfies('1.0.1', '1.0.0')
false
> satisfies('0.0.1', '0.0.0')
false

// When dependency is a Tilde range (bump on major and minor changes)
> satisfies('2.0.0', '~1.0.0')
false
> satisfies('1.0.0', '~0.0.0')
false

> satisfies('1.1.0', '~1.0.0')
false
> satisfies('0.1.0', '~0.0.0')
false

> satisfies('1.0.1', '~1.0.0')
true
> satisfies('0.0.1', '~0.0.0')
true

// When dependency is a Caret range (bump on major || or  always if major version is 0)
> satisfies('2.0.0', '^1.0.0')
false
> satisfies('1.0.0', '^0.0.0')  // major version was 0
false

> satisfies('1.1.0', '^1.0.0')
true
> satisfies('0.1.0', '^0.0.0') // major version was 0
false

> satisfies('1.0.1', '^1.0.0')
true
> satisfies('0.0.1', '^0.0.0') // major version was 0
false

*/
