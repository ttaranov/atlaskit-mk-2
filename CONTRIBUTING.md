# Contributing to Atlaskit

## Code of Conduct

This project is bound by a [Code of Conduct][codeofconduct].

Lots more information about contributing to this project can also be found on our website. See [getting-started][getting-started] for more.

## Reporting Issues

This section guides you through submitting a bug report for Atlaskit. Following these guidelines helps us and the community understand your issue, reproduce the behavior, and find related issues.

When you are creating an issue, please include as many details as possible. Fill out [the required template](ISSUE_TEMPLATE.md), the information it asks helps us resolve issues faster.

### Before submitting an issue

* **Perform a [cursory search][issuetracker]** to see if the problem has already been reported. If it has, add a comment to the existing issue instead of opening a new one.

### How do I submit a (good) issue?

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible. Add a link to a codesanbox example using [this codesanbox](http://go.atlassian.com/ak-sandbox) as starting point. When listing steps, **don't just say what you did, but explain how you did it**. For example, if you opened a inline dialog, explain if you used the mouse, or a keyboard shortcut.
* **If the problem wasn't triggered by a specific action**, describe what you were doing before the problem happened and share more information using the guidelines below.

Include details about your configuration and environment:

* **Which version of the component are you using?** You can get this information by running `yarn list --pattern @atlaskit` or `npm list | grep '@atlaskit'` from the command line.
* **What's the name and version of the browser and OS you're using**?

### Code Contributions

#### Why should I contribute?

1. While we strive to look at new issues as soon as we can, because of the many priorities we juggle and limited resources, issues raised often don't get looked into soon enough.
2. We want your contributions. We are always trying to improve our docs, processes and tools to make it easier to submit your own changes.
3. With the build system and auto-deployment to npm, using Atlaskit components in your projects simplifies your development stack. Treat Atlaskit as part of your codebase and make changes in it.
4. At Atlassian, "Play, As A Team" is one of our values. We encourage cross team contributions and collaborations.

Please raise a new issue:
- For Atlassians staff, please use this [internal link][atlassianbug].
- For External contributors, please use this [link][issuetracker].

# Contributing

Welcome to the Atlaskit MK2 repo. This repo works a bit differently than the
previous one as it has an entirely new build with many new tools and workflows.

A lot of these new build tools are still being developed and won't hit 1.0 for a
little while. So bear with us for a little while as we work out all the
problems.

Don't worry though, we're making it easier than ever to work on Atlaskit from
end to end. If you have any questions/problems, feel free to contact Luke Batchelor.

A more in-depth view of how we want to work with other teams and open source
contributions can be found on the
[website](https://atlaskit.atlassian.com/docs/guides/contributing).

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

Now you can start the development server for a specific component you are working on using
`bolt start <pkg-name>`, for example:

```sh
bolt start button
```

This will start the dev server with only packages matching "button"
pattern being served on http://localhost:9000.

#### Linux / Mac / Windows

The main `bolt` / `bolt install` commands work on all platforms. However, custom commands may not work in a Windows environment (i.e. `bolt start`). For now, if you're running Windows, you'll have to do the following:

1. Run `bolt` / `bolt install` from `cmd.exe`. It doesn't work in WSL.
2. Run any custom commands from WSL. We haven't made our custom scripts cross-platform yet.

#### In case you use IntelliJ IDEA or WebStorm

After running `bolt install` you will most likely experiencing issues with IDE indexing taking forever. VS Code does not have this problem. If you do not want to change the IDE you use, do the following: 

1. Close IntelliJ
1. run in terminal 
    ```
    {find . -type d -name 'node_modules' | grep 'node_modules$' | grep -v 'node_modules/' | while read line ; do echo "<excludeFolder url=\"file://\$MODULE_DIR$/$line\" />"; done;} | pbcopy
    ``` 
    This will find paths to each node_modules/ folder in the project, create <excludeFolder> tags for each of them and copy resulting text to clipboard 
1. Open `.idea/atlaskit.iml` in your favorite text editor. 
1. Pres Ctrl + V to paste text from clipboard after existing `<excludeFolder>` tags. Or paste inside `<content>` if you do not have `<excludeFolder>` tags. Save the file.
1. Open IntelliJ. You should be fine

Unfortunately, you will have to repeat this process if you pulled repository and new packages were introduced.

The root of this problem is in cyclical symbolic links between packages in node_modules, which exist because atlaskit-mk-2 is a mono repository. 
IntelliJ and WebStorm don't handle it properly. There are tickets raised in YouTrack to handle this situation.


## Exploring the Project

See the [directory structure docs](https://atlaskit.atlassian.com/docs/guides/directory-structure) for
more information.

## Writing new code

All new code should be written using either [Flow](https://flow.org) (and
[Babel](http://babeljs.io/)) or [TypeScript](http://www.typescriptlang.org/).

If you need to create a new package, simply create a directory for the package
and start putting files in the correct location (most things are based on file
conventions).

## Managing dependencies

If you're inside of a package directory, you can use the Bolt versions of Yarn's
existing add/upgrade/remove commands to modify the dependencies.

```sh
bolt add <dep>[@<version>] [--dev/peer/etc]
bolt upgrade <dep>[@<version>] [--dev/peer/etc]
bolt remove <dep>[@<version>] [--dev/peer/etc]
```

> Note: The `bolt upgrade` command is not implemented yet. To bump an external
> dep, you need to bump it in the root
>
> ```
> yarn upgrade depName@depRange
> ```

then manually make that change in each of the workspaces (you should be able to
find and replace since all packages should depend on the same range). You can
confirm this was done correctly run `bolt install`'ing at the root.

You can also manage dependencies for the project package, a specific workspace
package, or across all workspaces:

```sh
bolt project <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspace <pkg-name> <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
bolt workspaces <add/remove/upgrade> <dep>[@<version>] [--dev/peer/etc]
```

> Note that there are additional restrictions to dependencies in Bolt than there
> are in Yarn, so you should not use `yarn` to manage dependencies.

## Type checking your code

We use both [Flow](https://flow.org/) and
[TypeScript](http://www.typescriptlang.org/) inside of Atlaskit. Each package
uses one or the other depending on the team that owns the package.

Be sure to setup IDE integrations for both so you get the full benefits out of
them.

* Atom: [IDE](https://ide.atom.io/)
* Sublime: [Flow](https://flow.org/en/docs/editors/sublime-text/),
  [TypeScript](https://github.com/Microsoft/TypeScript-Sublime-Plugin)
* Vim: [Flow](https://flow.org/en/docs/editors/vim/),
  [TypeScript](https://github.com/leafgarland/typescript-vim)
* VSCode: [Flow](https://flow.org/en/docs/editors/vscode/), TypeScript
  (built-in)

If you want to run both type checkers on all files from the command line you can
run:

```sh
bolt typecheck
```

## Linting your code

We use ESLint to lint all of the JavaScript/Flow code within Atlaskit, and
TSLint to lint all of the TypeScript code.

You'll probably want to setup IDE integrations for both within your editor,
doing so will ensure that you don't have to go back and fix up lots of code
later on.

* Atom: [ESLint](https://github.com/AtomLinter/linter-eslint),
  [TSLint](https://github.com/AtomLinter/linter-tslint)
* Sublime: [ESLint](https://github.com/roadhump/SublimeLinter-eslint),
  [TSLint](https://github.com/lavrton/SublimeLinter-contrib-tslint)
* Vim: [Syntastic](https://github.com/vim-syntastic/syntastic)
* VS Code:
  [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
  [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint)

If you want to run the linter on all files from the command line you can run:

```sh
bolt lint
```

## Creating examples

To create a new example for a component, you can create a new file in the
component package's `examples/` folder.

```
/atlaskit-mk2/packages/core/avatar/examples/
├── 0-overview.js
└── 1-groups.js (New File)
```

Inside of the example you should import components by their package name
instead of a relative path.

```js
import React from 'react';
import { Presence } from '@atlaskit/avatar';

export default function Example() {
  return <Presence presence="online" />;
}
```

In order to view these examples within your browser, from the root of atlaskit-mk2 you can run:

```sh
bolt start
```

To run the examples on a different port, set the `ATLASKIT_DEV_PORT` environment variable.

```sh
ATLASKIT_DEV_PORT=9001 bolt start
```

### Running only a subset

Sometimes you really only want to run a small subset of examples. Depending on what you are trying to achieve the following scripts might be useful:

```sh
bolt start:core # start the website only for packages under packages/core
bolt start:media # start the website only for packages under packages/media
bolt start:editor # start the website only for packages under packages/editor
# etc
```

If you need even more fine grained control you might even like to set up an alias like this in your `.bashrc` or equivalent.

```sh
function atlastart() {
    yarn run projector ./projector.js start --packages "$1"
}
```

No you can start the website with the specific packages you want rather than entire directories at a time

```sh
atlastart flag,tooltip
```

## Testing your code
### Running tests
 - unit tests
 ```sh
  yarn jest
 ```
 - browser unit tests
 ```sh
  yarn run test:browser
 ```
 - webdriver tests
 ```sh
  yarn run test:webdriver
 ```

Please refer to [testing in atlaskit][testing] for more information about testing.

### Building and linking packages

You should almost never have to worry about this as everything is handled automatically in CI, but if for whatever reason you need to manually build packages (e.g you are trying to link them in another project) you *can* do this, but it can be a little tricky.

How you do this will completely depend on what *exactly* you are trying to achieve and with which packages. A single command would never be able to handle each of these edge cases safely.

> **"Can't you just give me a command to run though?"**
>
> Okay.
>
> If your package is a flow package run:
>
> NODE_ENV=production BABEL_ENV=production:cjs bolt workspaces exec --only "@atlaskit/pkgName" -- babel src -d dist/cjs
>
> **or** if you know that you are consuming the package as a module:
>
> NODE_ENV=production BABEL_ENV=production:esm bolt workspaces exec --only "@atlaskit/pkgName" -- babel src -d dist/esm
>
> If your package is written in TS:
> NODE_ENV=production bolt workspaces exec --only "@atlaskit/pkgName" -- tsc --project ./build/es5
> **or** if you know that you are consuming the package as a module:
> NODE_ENV=production bolt workspaces exec --only "@atlaskit/pkgName" -- tsc --project ./build/es2015
>
> **THESE WILL NOT COVER 100% OF USE CASES AND ARE PROVIDED WITHOUT WARRANTY**
>
> In certain circumstances you'll need to have a dependency be built, in others you'll need to make sure you've run `build:pkg` to copy the package.json's into `dist/`, in others, you will need to generate certain schema files.


## Documenting your code

Inside of every package is a `docs/` folder which includes all of the
documentation pages (there's generally only one).

```
/atlaskit-mk2/packages/core/avatar/docs/
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

Packages are released automatically once they reach `master` and are done so
using `Changeset` commits.

When you wish to release a package, simply run `yarn changeset` and the wizard
will guide you.

When releasing a package, you will also need to bump the dependencies of all
packages that depend on that package, the wizard will prompt for the type of
change for each of these releases (`patch`, `minor` or `major`).

The `summary` used during the creation of a changeset will also be used to
create the changelog entry for each package being released.


> **How does this work?** Running the `yarn changeset` command creates a commit
> with all the information required to release a package. When a branch is
> merged to master, all the unreleased changesets are combined, new versions are
> calculated, packages and dependencies are updated, changelogs are generated
> and packages are released

More information about this can be found [here][releasing-packages] and in the [faq][faq]

[codeofconduct]: ./CODE_OF_CONDUCT.md
[issuetracker]: https://bitbucket.org/atlassian/atlaskit-mk-2/issues?status=new&status=open
[atlassianbug]: http://go/ak-bug
[testing]: https://atlaskit.atlassian.com/docs/guides/testing
[releasing-packages]: https://atlaskit.atlassian.com/docs/guides/releasing-packages
[getting-started]: https://atlaskit.atlassian.com/docs/getting-started
[faq]: https://atlaskit.atlassian.com/docs/guides/frequently-asked-questions
