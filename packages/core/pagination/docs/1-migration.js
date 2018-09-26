//@flow
import { code, md } from '@atlaskit/docs';

export default md`
## v7 to v8

### 🎉 ADG styling

Pagination has ADG styling v8 onward.

### 🎉 No change in API

There are no changes in the Pagination API. Therefore, no code change will required to usage of the new ADG styled Pagination component.

### 🚨 Styles changes

As per ADG spec Pagination component should have a spacing of 24px on top. v7 of the pagination component also did not have margin-top styling so you may already have it in you code. However, if you do not have this spacing then please add bottom spacing of 24px to the previous element.

Example:

${code`
<div>
    <div style={{marginBottom: '24px'}}>
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
