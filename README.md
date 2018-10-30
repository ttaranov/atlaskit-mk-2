# Atlaskit

[![node v8.4.0+](https://img.shields.io/badge/node-v8.4.0%2B-brightgreen.svg)](https://nodejs.org/en/) 
[![bolt v0.20.6+](https://img.shields.io/badge/bolt-v0.20.6%2B-brightgreen.svg)](http://boltpkg.com/)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg)](https://bitbucket.org/atlassian/atlaskit-mk-2/issues?status=new&status=open)

Atlaskit is the technical implementation of the [Atlassian Design Guidelines][adg]. It is a collection of reusable components that can be downloaded independently into your projects. Each component is also independently versioned and published to npm.

The full list of components can be found in the [Atlaskit Registry][atlaskitregistry].

**This project is bound by a [Code of Conduct][codeofconduct].**

# Usage

#### Pre-requisites

It's strongly advised to use the Atlaskit CSS reset in your whole project, or some Atlaskit components
may diverge in appearance:

```javascript
import '@atlaskit/css-reset';
```

In general, you should avoid directly styling base elements (ex. p, h1, h2) and uses classes instead.

#### Example for React projects

Atlaskit components are built for React. Here's an example of using the Avatar component:

1. First, you specify a component into your project as a dependency using npm: `npm install @atlaskit/avatar`
2. Then you can use it in your React projects like this:

```javascript
import React from 'react';
import Avatar from '@atlaskit/avatar';

export default (
  <Avatar
    src="https://design.atlassian.com/images/avatars/project-128.png"
    presence="online"
    size="large"
  />
);
```

Check out the [Atlaskit Registry][atlaskitregistry] to learn more.

#### Example for non-React projects

There is a subset of components available as styles called the Reduced UI pack.
To use:

1. You include these into your the HTML projects.

```html
<link rel="stylesheet" href="//unpkg.com/@atlaskit/css-reset@latest" />
<link rel="stylesheet" href="//unpkg.com/@atlaskit/reduced-ui-pack@latest" />
```

2. Then you can style HTML with

`<button class="ak-button ak-button__appearance-primary">Submit</button>`

Check out the [Reduced UI pack](http://go.atlassian.com/reduced-ui-pack) for more examples and details.

#### Upgrades

When upgrading an Atlaskit component, all changelogs can be found in the [Atlaskit Registry][atlaskitregistry].

# Installation

#### Before you start

* [node](https://nodejs.org/) version should be 6 or above (to check `node -v`) or use [nvm](https://github.com/creationix/nvm)
* [npm](https://www.npmjs.com/) version should be 3 or above (to check `npm --version`)
* [yarn](https://yarnpkg.com/) should be installed globally (see yarn website for installation instructions)

#### Clone the repo and install

```sh
git clone git@bitbucket.org:atlassian/atlaskit-mk-2.git
yarn
```

You're now ready to start developing in Atlaskit!

Each component/util lives in it's own package under the `packages` directory. We are using [bolt](https://github.com/boltpkg/bolt) to manage our mono-repo, so you are going to need bolt installed globally as well.

```sh
yarn global add bolt
```

Next, to install packages, we use bolt, just calling it:

```sh
bolt
```

For contributing back, check out our [contribution guide](http://atlaskit.atlassian.com/docs/guides/contributing)

# Documentation

A comprehensive list of components and detailed usage of each can be found in the [Atlaskit Registry][atlaskitregistry], which contains both guides on contributing to atlaskit, as well as documentation for each package.

You can also find how each component is meant to be used from a design perspective on the [Atlassian Design Guidelines][adg] website.

# Reporting issues

We believe in open contributions and the power of a strong development community. Please read our [Contributing guidelines][contributing] on how to contribute back and report issues to Atlaskit.

# Contributors

Pull requests, issues and comments are welcomed. 

For pull requests:

* Do not raise pull requests from forks because our CI builds do not run on forks. Create a pull request from a branch instead.
* Add tests for new features and bug fixes
* Follow the existing style
* Separate unrelated changes into multiple pull requests
* Read [Contributing guidelines][contributing] for more details

See the existing issues for things to start contributing. For bigger changes, make sure you start a discussion first by creating an issue and explaining the intended change.

#### Become a contributor

 If this is your _first time_ to raise a pull request, you need to be added to the 'atlaskit contributor' team in order to create branches for your pull requests. To be added, create an [issue](https://bitbucket.org/atlassian/atlaskit-mk-2/issues?status=new&status=open) and include the following:

1. Issue title - __"Become an Atlaskit contributor"__
2. Your Bitbucket username and
3. Reasons you'd want to be a contributor - e.g. Reference another issue that you'd like to provide a PR for.
4. Have signed or be ready to sign the Contributor License Agreement(CLA). See below.

Atlassian requires contributors to sign a Contributor License Agreement,
known as a CLA. This serves as a record stating that the contributor is
entitled to contribute the code/documentation/translation to the project
and is willing to have it used in distributions and derivative works
(or is willing to transfer ownership).

Prior to accepting your contributions we ask that you please follow the appropriate
link below to digitally sign the CLA. The Corporate CLA is for those who are
contributing as a member of an organization and the individual CLA is for
those contributing as an individual.

* [CLA for corporate contributors](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=e1c17c66-ca4d-4aab-a953-2c231af4a20b)
* [CLA for individuals](https://na2.docusign.net/Member/PowerFormSigning.aspx?PowerFormId=3f94fbdc-2fbe-46ac-b14c-5d152700ae5d)

# License

This is a [mono-repo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md), which means that different parts of this repository can have different licenses.

The base level of the repository is licensed under [Apache 2.0][license]. There are separate license files (`LICENSE`) for each component under `/packages` that specify the license restrictions for each component. While most components are licensed under the Apache 2.0 license, please note packages containing styles, assets & icons are most likely licensed under the [Atlassian Design Guidelines license][adg_license].

If you fork this repository you can continue to use those Atlassian Design Guidelines licensed components only under the given license restrictions. If you want to redistribute this repository, you will need to replace these Atlassian Design Guidelines licensed components with your own implementation.

Copyright (c) 2018 Atlassian and others.

[adg]: http://atlassian.design/ "Atlassian Design Guidelines"
[adg_license]: https://atlassian.design/guidelines/handy/license
[contributing]: ./CONTRIBUTING.md
[license]: ./LICENSE
[atlaskitregistry]: https://atlaskit.atlassian.com/ "Atlaskit Registry"
[codeofconduct]: ./CODE_OF_CONDUCT.md
