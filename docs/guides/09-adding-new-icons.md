---
title: Adding New Icons
---

# Adding New Icons

!!IMPORTANT

The icons package has a custom build process, as it generates its both stripped
svgs and glyphs that are committed to the repo, so that they can be accessed as
paths when published.

Adding or updating a new icon:
* Add / update the icon under `packages/core/icon/utils/raw_svgs`
* Run `yarn update` from within the `packages/core/icon` directory

New Icons should be added to `/packages/core/icon/utils/raw_svgs`.

**NOTE:** The `reduced-ui-pack` package should contain all the icons we include
in this package. Make sure to rebuild the `reduced-ui-pack` sprite as outlined in
the README.md file included within that package.

If your icon is used only in a specific context or product, place it in
  `/icon/src/icons/subfolder` and it will be namespaced appropriately.


## Generating an svg

## Building stripped svg and glyphs

## Verifying and committing your new icon
