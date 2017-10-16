# Contributing

Welcome to the Atlaskit MK2 repo. This repo works a bit differently than the
previous one as it has an entirely new build with many new tools and workflows.

A lot of these new build tools are still being developed and won't hit 1.0 for
a little while. So bear with us for a little while as we work out all the
problems.

Don't worry though, we're making it easier than ever to work on Atlaskit from
end to end. If you have any questions/problems, feel free to contact James Kyle
or Luke Batchelor.

That all being said, let's dive into it:

### Getting Started

To clone the repository (you'll need [git](https://git-scm.com/) installed if
you don't already), open up your terminal and run the following:

```sh
git clone git@bitbucket.org:atlassian/atlaskit-mk-2.git
cd atlaskit-mk-2
```

Then you'll need both [Node.js](https://nodejs.org/) and
[Yarn](https://yarnpkg.com/) installed. If you're on a Mac and have
[Homebrew](https://brew.sh/) you can run:

```sh
brew install node yarn
```

> **Note:** You must be on Node >=8.4 and Yarn >=1.0

Then you can install [Bolt](https://github.com/boltpkg/bolt):

```sh
yarn global add bolt
```

Now that you have everything you need, you can bootstrap the Atlaskit repo:

```sh
cd atlaskit-mk-2
bolt install
```

This will take a minute or two the first time, but every subsequent run should
only take about a second.

## Exploring the Project

Before you dive into the Atlaskit repo, you'll want to familiarize yourself
with your surroundings.

Atlaskit is a multi-package repo (sometimes called a "monorepo"), meaning that
from a single repository we develop and publish many different packages.

```
atlaskit-mk-2 (Project)
├── packages ································· Public packages
│   └── elements ····························· Package group
│       └── avatar (Workspace) ··············· Package
│           ├── src ·························· Package source code
│           │   ├── index.js
│           │   │   ├── components ··········· Components
│           │   │   │   └── Avatar.js
│           │   │   └── styled ··············· Component styles
│           │   │       └── Avatar.js
│           │   └── __tests__ ················ Package unit tests
│           │       └── index.test.js
│           ├── examples ····················· Package examples
│           │   └── 0-overview.js
│           ├── docs ························· Package documentation
│           │   └── 0-overview.js
│           └── package.json ················· Package config
├── patterns (Workspace) ····················· Cross-component examples -
│   └── jira
│       └── 0-navigation.js
├── releases ································· Release blog posts
│   └── dark-mode.md
├── docs ····································· Project documentation
│   └── getting-started.md
├── build ···································· Build-related packages
├── website (Workspace) ······················ Website package
└── package.json ····························· Project config
```

## Writing new code

All new code should be written using either [Flow](https://flow.org) (and
[Babel](http://babeljs.io/)) or [TypeScript](http://www.typescriptlang.org/).

If you need to create a new package, simply create a directory for the package
and start putting files in the correct location (most things are based on
file conventions).

## Managing dependencies

If you're inside of a package directory, you can use the Bolt versions of
Yarn's existing add/upgrade/remove commands to modify the dependencies.

```sh
bolt add <dep>[@<version>] [--dev/peer/etc]
bolt upgrade <dep>[@<version>] [--dev/peer/etc]
bolt remove <dep>[@<version>] [--dev/peer/etc]
```

You can also manage dependencies for the project package, a specific workspace
package, or across all workspaces:

```sh
bolt project <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspace <pkg-name> <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspaces <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
```

> Note that there are additional restrictions to dependencies in Bolt than
> there are in Yarn, so you should not use `yarn` to manage dependencies.

## Unit testing your code

You can run the unit tests by running:

```sh
bolt test
```

If you want to run them continuously, you can run:

```sh
bolt test --watch
```

## Type checking your code

We use both [Flow](https://flow.org/) and
[TypeScript](http://www.typescriptlang.org/) inside of Atlaskit. Each package
uses one or the other depending on the team that owns the package.

Be sure to setup IDE integrations for both so you get the full benefits out of
them.

- Atom: [IDE](https://ide.atom.io/)
- Sublime: [Flow](https://flow.org/en/docs/editors/sublime-text/), [TypeScript](https://github.com/Microsoft/TypeScript-Sublime-Plugin)
- Vim: [Flow](https://flow.org/en/docs/editors/vim/), [TypeScript](https://github.com/leafgarland/typescript-vim)
- VSCode: [Flow](https://flow.org/en/docs/editors/vscode/), TypeScript (built-in)

If you want to run both type checkers on all files from the command line you
can run:

```sh
bolt check
```

## Linting your code

We use ESLint to lint all of the JavaScript/Flow code within Atlaskit, and
TSLint to lint all of the TypeScript code.

You'll probably want to setup IDE integrations for both within your editor,
doing so will ensure that you don't have to go back and fix up lots of code
later on.

- Atom: [ESLint](https://github.com/AtomLinter/linter-eslint), [TSLint](https://github.com/AtomLinter/linter-tslint)
- Sublime: [ESLint](https://github.com/roadhump/SublimeLinter-eslint), [TSLint](https://github.com/lavrton/SublimeLinter-contrib-tslint)
- Vim: [Syntastic](https://github.com/vim-syntastic/syntastic)
- VS Code: [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

If you want to run the linter on all files from the command line you can run:

```sh
bolt lint
```

## Creating examples and patterns

To create a new example for a component, you can create a new file in the
component package's `examples/` folder.

```
/atlaskit-mk2/packages/elements/avatar/examples/
├── 0-overview.js
└── 1-groups.js (New File)
```

Or if you want to create a cross-component pattern example, you can create a
new file inside of the `patterns/` folder.

```
/atlaskit-mk2/patterns/
└── jira
    ├── 0-navigation.js
    └── 1-drag-and-drop.js (New File)
```

Inside of the example or pattern you should import components by their package
name instead of a relative path.

```js
import React from 'react';
import { AvatarGroup } from '@atlaskit/avatar';

export default function Example() {
  return <AvatarGroup appearance="grid" data={...}/>;
}
```

In order to view these examples within your browser, you can run:

```sh
bolt examples
```

## Browser testing your code

> This is not yet supported

## Documenting your code

Inside of every package is a `docs/` folder which includes all of the
documentation pages (there's generally only one).

```
/atlaskit-mk2/packages/elements/avatar/docs/
├── 0-overview.js
└── 1-groups.js
```

Each of these files looks something like this:

```js
// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  # Avatar

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a tempor
  ex. Cras nisl magna, luctus in facilisis at, mattis sed lacus.

  ${<Example source={...} />}

  ${<Props source={...} />}
`;
```

## Releasing packages

Packages are released automatically once they reach `master` and are done so using `Changeset` commits.

When you wish to release a package, simply run `yarn changeset` and the wizard will guide you.

When releasing a package, you will also need to bump the dependencies of all packages that depend on that package, the wizard will prompt for the type of change for each of these releases (`patch`, `minor` or `major`).

The `summary` used during the creation of a changeset will also be used to create the changelog entry for each package being released.

> **Soon:** You will be able to see which packages will be released at which versions from the Pull Request screen, similar to the way it used to work

> **How does this work?** Running the `yarn changeset` command creates a commit with all the information required to release a package. When a branch is merged to master, all the unreleased changesets are combined, new versions are calculated, packages and dependencies are updated, changelogs are generated and packages are released