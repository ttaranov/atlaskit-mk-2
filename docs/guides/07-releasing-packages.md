# Committing code & releasing packages

Related reading:

* [Versioning](./versioning)

## Committing your code

`git add .`

`git commit -m "your message here"`

This will run prettier over your changed files before doing a commit.

## Releasing packages

Packages that have been changed will not automatically be released. Instead, you
need to create a changeset. A changeset is an empty commit that informs the
release process of what packages to release. Generating a changeset is done
through a command, that walks you through the choices you need to make.

To start creating a changeset, you need to run

Start creating a changeset `bolt changeset`

### Step 1: Select packages to release

You will be prompted to select packages to release. This will be divided into
packages that have changes since their last release, and other packages (if you
believe something will need updating).

Press space to select an item, and enter once you have made your selection of
releases.

### Step 2: Write a summary of the release

You will be prompted to write a summary. This will be used in the changelog for
the packages you have selected to release.

### Step 3: Select Versions

For each package you have chosen to release, you will be prompted to select a
version of that package. This will need to be either 'patch', 'minor', or
'major'.

You will also be prompted to select a version range for internal packages that
may need their version bumped. If none of its dependencies are currently leaving
its dependency range, you will be offered a 'none' options, however if this
later becomes untrue, you will need to reselect a version.

Once you have made all choices about packages to be released, you will be shown
the changeset object and confirm if you wish to commit it.
