//@flow
import { code, md } from '@atlaskit/docs';

export default md`
## v7 to v8

### 🎉 ADG styling

In v8 pagination styling has been updated.

### 🎉 No changes in the API

There are no changes in the Pagination API. 
Therefore, no code change will be required to consume this major version. 
However, you might need to update your styling.

### 🚨 Styles changes

There must be spacing a 24px ( \`3 * gridSize\` ) between pagination and anything above it.
Add this spacing to the element above the pagination component.

In v7 this spacing was not there either, but because in v8 the buttons have a dark background color the experience will appear broken if this spacing is not there.

Have your designers check that this change does not break the look within your app. Functionaly there no changes in the component.

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
