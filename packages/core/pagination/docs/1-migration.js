//@flow
import { code, md } from '@atlaskit/docs';

export default md`
## v7 to v8

### 🎉 ADG styling

As of version 8, pagination’s styling has been updated to match the ADG style guide.

### 🎉 No changes in the API

There are no changes in the Pagination API. Therefore, no code change will be required to consume this major version. However, You should make sure designers check that this change does not break the look within your app, but otherwise this upgrade is completely safe.

### 🚨 Styles changes

As per ADG spec Pagination component should have a spacing of 24px ( \`3 * gridSize\` ) on top. v7 of the pagination component also did not have margin-top styling so you may already have it in you code. However, if you do not have this spacing then please add bottom spacing of 24px to the previous element.

Example:

${code`
import { gridSize } from '@atlaskit/theme';

<div>
    <div style={{marginBottom: (gridSize() * 3) + 'px'}}>
        <!-- Your awesome page -->
    </div>
    <Pagination
        defaultValue={5}
        total={10}
        onChange={e => console.log('page changed', e)}
    />
</div>
`}
`;
