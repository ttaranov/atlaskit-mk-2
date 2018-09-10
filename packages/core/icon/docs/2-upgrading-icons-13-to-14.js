// @flow
import React from 'react';
import { md, code } from '@atlaskit/docs';

import { DynamicTableStateless } from '@atlaskit/dynamic-table';

const Table = ({
  name,
  changedValues,
}: {
  name: string,
  changedValues: { [string]: string },
}) => (
  <DynamicTableStateless
    caption={name}
    head={{
      cells: [
        { key: 'old location', content: 'old location' },
        { key: 'new location', content: 'new location' },
      ],
    }}
    rows={Object.entries(changedValues).map(([oldLocation, newLocation]) => ({
      // $FlowFixMe
      key: oldLocation + newLocation,
      cells: [
        { key: oldLocation, content: code`${oldLocation}` },
        { key: newLocation, content: code`${newLocation}` },
      ],
    }))}
  />
);

const logoSizeMap = [
  { oldSize: 'default', newSize: 'small', pixelValue: '24px' },
  { oldSize: 'small', newSize: 'xsmall', pixelValue: '16px' },
  { oldSize: 'medium', newSize: 'small', pixelValue: '24px' },
  { oldSize: 'large', newSize: 'medium', pixelValue: '32px' },
  { oldSize: '-', newSize: 'large', pixelValue: '40px' },
  { oldSize: 'xlarge', newSize: 'xlarge', pixelValue: '48px' },
];

const SizeTable = () => (
  <DynamicTableStateless
    caption="Changes to the size prop"
    head={{
      cells: [
        { key: 'old size', content: 'old size' },
        { key: 'new size', content: 'new size' },
        { key: 'pixel value', content: 'pixel value' },
      ],
    }}
    rows={logoSizeMap.map(({ oldSize, newSize, pixelValue }) => ({
      key: pixelValue,
      cells: [
        { key: oldSize, content: oldSize },
        { key: newSize, content: newSize },
        { key: pixelValue, content: pixelValue },
      ],
    }))}
  />
);

const logoLocation = {
  '@atlaskit/icon/glyph/atlassian':
    '@atlaskit/logo/dist/esm/AtlassianLogo/Icon',
  '@atlaskit/icon/glyph/bitbucket':
    '@atlaskit/logo/dist/esm/BitbucketLogo/Icon',
  '@atlaskit/icon/glyph/confluence':
    '@atlaskit/logo/dist/esm/ConfluenceLogo/Icon',
  '@atlaskit/icon/glyph/hipchat': '@atlaskit/logo/dist/esm/HipchatLogo/Icon',
  '@atlaskit/icon/glyph/jira-core': '@atlaskit/logo/dist/esm/JiraCoreLogo/Icon',
  '@atlaskit/icon/glyph/jira': '@atlaskit/logo/dist/esm/JiraLogo/Icon',
  '@atlaskit/icon/glyph/jira-service-desk':
    '@atlaskit/logo/dist/esm/JiraServiceDeskLogo/Icon',
  '@atlaskit/icon/glyph/jira-software':
    '@atlaskit/logo/dist/esm/JiraSoftwareLogo/Icon',
  '@atlaskit/icon/glyph/statuspage':
    '@atlaskit/logo/dist/esm/StatuspageLogo/Icon',
  '@atlaskit/icon/glyph/stride': '@atlaskit/logo/dist/esm/StrideLogo/Icon',
};

export default md`
### Upgrading Icons to version 14

Version 14 of icons resorts our icons into better locations.
There is a full explanation below, but to start, here are the icons
that are affected.

### Swap the icon \`JiraMajorIcon\` and \`JiraMinorIcon\`

These icons are named incorrectly in atlaskit, so we're taking the opportunity of a breaking change to switch these around.

#### Product Logo Icons

The following icons have been removed from \`@atlaskit/icons\` and we
are recommending that they are imported from \`@atlaskit/logo\` going
forward. The icons are:

${<Table name="Moved to logo" changedValues={logoLocation} />}

In additiona to being moved, the move to logo comes with a change to how
sizing will affect these icons:

${<SizeTable />}

#### Object Icons

Similarly, object icons use different svgs for different sizes, and so are incompatible
with the architecture of the \`@altaskit/icon\` package. As such, they are
being given their own package: \`@atlaskit/icon-object\`. These icons can be
identified with the following pattern:

${(
  <Table
    name="Moved to icon-object"
    changedValues={{
      '@atlaskit/icon/glyph/object/16/file-16-ICON_NAME':
        '@atlaskit/icon-object/glyph/ICON_NAME/16',
      '@atlaskit/icon/glyph/object/24/file-24-ICON_NAME':
        '@atlaskit/icon-object/glyph/ICON_NAME/24',
    }}
  />
)}

You will need to install the \`@atlaskit/icon-object\` package to use these.

Other notable differences for object icons are:
- They do not accept a sizing prop - their size is fixed to the imported svg
- They can be required at only two sizes (16px and 24px)
- Their colors are fixed

#### File-type Icons

Similarly, file-type icons use different svgs for different sizes, and so are incompatible
with the architecture of the \`@altaskit/icon\` package. As such, they are
being given their own package: \`@atlaskit/icon-file-type\`. These icons are:

${(
  <Table
    name="Moved to icon-file-type"
    changedValues={{
      '@atlaskit/icon/glyph/file-types/16/file-16-ICON_NAME':
        '@atlaskit/icon-file-type/glyph/ICON_NAME/16',
      '@atlaskit/icon/glyph/file-types/24/file-24-ICON_NAME':
        '@atlaskit/icon-file-type/glyph/ICON_NAME/24',
    }}
  />
)}

Other notable differences for object icons are:
- They do not accept a sizing prop - their size is fixed to the imported svg
- They can be required at only three sizes (16*16px, 24*24px, and 48*64px)
- The largest size of these icons is not square, unlike all other icons
- Their colors are fixed

### Why these changes?

The icons package was architected with several implicit decisions that defined
what icons are:

- icons are svgs with a 24*24px canvas
- they can be scaled to 16px, 24px (default), 32px, and 48px
- they feature one or two colors that are editable by props

One of the other important features of icons is that they need a unique build step,
different to what other components in the atlaskit repository need.

As we have evolved our visual style, we have had more and more items that from a
design-perspective are definitely icons, however have failed to meet the architectural
guidelines of the \`@atlaskit/icons\` package. We have generally endeavoured to add
these in to the icons package, but we have enough that we needed a better solution. The
biggest driver of this was icons that had separate svgs for different sizes.

Adding a way to handle this into icon's existing architecture was not going to work. We
defined an API for multi-svg icons that is fundamentally incompatible with the existing
icons API. While it was possible to ship both APIs from a single package, learning which
icons used which API was going to be trial and error.

By using different packages, we want to make clear distinctions between how to use an icon.
`;
