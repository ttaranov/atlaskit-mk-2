//@flow
import { code, md } from '@atlaskit/docs';

export default md`
## v8 to v9

### 🎉 Render Prop

Pagination now supports render props.

Three new components are added to the

**Page**: This is the actual component that you will use to display you page

**LeftNavigation**: A react component that displays the left navigation button

**RightNavigation**: A react component that displays the right navigation button

**Ellipses**: This will pring '...'  in the page, this is used to skip the pages

and a new export from the package:

**collapseRange**: This is a util function which takes in maximumVisiblePages, current page value and pages as arguments
and returns an array of items to know

### 🚗 Migrate from v7

To take an example if in v7 you were using a simple pagination which showed 10:

${code`
<Pagination
    value={5}    // selected value
    total={10}  // Total number of pages
    onChange={e => console.log('page changed', e)} // onChange hook with page selected
/>
`}

Drawbacks with above approach:

- You cannot control the total number of pagesNumber's displayed, it is constant 7.
- You have no control over what you display on page number, by that I mean it always displays 1,2,3... there is no
support for localisation.
- We cannot render Link component for routing with react-router, etc.

This can we re-written as:

${code`
import Pagination, { collapseRange } from '@atlaskit/pagination';

const MAX_VISIBLE_PAGES = 7;

export default class ManagedPagination extends Component<Props> {
  onChange = (newValue: number) => {
    this.props.onChange(newValue);
  };

  render() {
    const { total, value = 1, i18n } = this.props;
    const items = [...Array(total)].map((_, index) => index + 1);
    const pageLinksCollapsed = collapseRange(MAX_VISIBLE_PAGES, value, items);
    return (
      <Pagination>
        {(LeftNavigator, Page, RightNavigator, Ellipses) => (
          <Fragment>
            <LeftNavigator
              ariaLabel={i18n.prev}
              isDisabled={value === 1}
              onClick={() => this.onChange(value - 1)}
            />
            {pageLinksCollapsed.map((pageNumber, key) => {
              if (pageNumber === '...') {
                //eslint-disable-next-line
                return <Ellipses key={\`\${pageNumber}-\${key}\`} />;
              }
              return (
                <Page
                  key={\`\${pageNumber}\`}
                  isSelected={pageNumber === this.props.value}
                  onClick={() => this.onChange(pageNumber)}
                >
                  {pageNumber}
                </Page>
              );
            })}
            <RightNavigator
              ariaLabel={i18n.next}
              isDisabled={value === total}
              onClick={() => this.onChange(value + 1)}
            />
          </Fragment>
        )}
      </Pagination>
    );
  }
}
`}


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
