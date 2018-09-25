# Commit List

> React component rendering commits panel.

## Usage

Detailed docs and example usage can be found [here](https://atlaskit.atlassian.com/packages/bitbucket/commit-list).

```
import { CommitList } from '@atlaskit/bitkit-commit-list';

export const commitsArray = [
  {
    hash: '7806e45c7715ed7a4a179073e6bd1dd61a41a02b',
    message: 'unit Tests (Python) - P5',
    date: '2017-08-04T14:48:00.000Z',
    url: 'https://www.some-url.com',
    author = {
      display_name: 'John Doe',
      links: {
        avatar: {
          href: 'http://static.tumblr.com/c172fd03bf2bedb77e13107cb22cdcc1/3rxa3xq/asBo7l3wr/tumblr_static_6fbdkgohxjgoc4c8o8kwoso4k.png',
        },
      },
    },
    links = {
      self: {
        href: 'https://www.some-url.com',
      },
    },
  },
  {
    hash: 'e3ab666d6ef1489d97b57e41f77b6f9f16d14870',
    message: 'Linting (eslint)',
    date: '2017-08-05T14:48:00.000Z',
    url: 'https://www.some-url.com',
    author = {
      display_name: 'John Doe',
      links: {
        avatar: {
          href: 'http://static.tumblr.com/c172fd03bf2bedb77e13107cb22cdcc1/3rxa3xq/asBo7l3wr/tumblr_static_6fbdkgohxjgoc4c8o8kwoso4k.png',
        },
      },
    },
    links = {
      self: {
        href: 'https://www.some-url.com',
      },
    },
  },
];

const commitsExample = () => (
  <CommitList
    commits={commitsArray}
  />
);
```

## API

### `<CommitList>`

Renders a list of commits

#### props
- `commits` (Array`<Commit>`): Array of commit objects
- `hasMore` boolean: Display a "show more" link to display more commits
- `isLoading` boolean: Display a spinner while loading more commits
- `onShowMoreClick` Function: Callback function to trigger loading more commits
- `linkTarget` string (optional): sets the `target` attribute on commit links
- `showCommitSelector` boolean: Displays radio buttons to select a single commit. (Protip: Use the `<CommitSelector>` component instead)
- `handleCommitChange` Function (internal): Used by `<CommitSelector>` to update selected commit state
- `selectedCommitRangeStart` string (internal): Specify the starting commit range hash. Used by `<CommitSelector>` to update selected commit state 
- `selectedCommitRangeEnd` string (internal): Specify the ending commit range hash. Used by `<CommitSelector>` to update selected commit state
- `mergeBaseHash` string (internal): Specify the merge base commit hash. Used by `<CommitSelector>` to update selected commit state

### `<CommitSelector>`

Renders a list of commits with checkboxes to select and individual commit.

#### props
All the same props as `<CommitList>`, and
- `onCommitRangeChange` Function: Callback function for when a commit is selected

## Installation

```sh
yarn add @atlaskit/commit-list
```

## Developing

Develop your component locally against the demo server.

    bolt demo packages/commit-list

Then browse to `localhost:3001/webpack-dev-server/main`

Run the tests from the root of the repository:

    bolt run test packages/commit-list


## Building

Run `npm run <X>`:

* `build:cjs` - build the CommonJS target, this is the 'normal' ES5 lib
* `build:es` - build the ES6 target, using module imports
* `build:umd` - build the UMD target, able to be used by a browser script tag
* `build` - build (allthethings)

Builds will happen automatically upon publishing
