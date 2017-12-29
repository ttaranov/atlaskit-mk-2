// import { shallow, ShallowWrapper } from 'enzyme';
// import * as React from 'react';
// import { GlobalQuickSearch } from '../index';
// import { AkQuickSearch, AkNavigationItemGroup } from '@atlaskit/navigation';

// function timeout(ms = 1) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function searchFor(term: string, wrapper: ShallowWrapper) {
//   const quicksearch = wrapper.find(AkQuickSearch);
//   const onSearchInput = quicksearch.props()['onSearchInput'];

//   onSearchInput({ target: { value: term } });
//   await timeout(); // wait a tick until search request has finished
// }

// const emptyResultsProvider = providerReturns(Promise.resolve([]));

// describe('GlobalQuickSearch', () => {

//   it('should set loading state when searching', () => {
//     const wrapper = shallow(<GlobalQuickSearch resourceProvider={emptyResultsProvider} />);

//     searchFor('dav', wrapper);
//     expect(wrapper.find(AkQuickSearch).prop('isLoading')).toBeTruthy();
//   });

//   it('should unset loading state when search has finished', async () => {
//     const wrapper = shallow(<GlobalQuickSearch resourceProvider={emptyResultsProvider} />);

//     await searchFor('dav', wrapper);
//     expect(wrapper.find(AkQuickSearch).prop('isLoading')).toBeFalsy();
//   });

//   it('should should reset loading state when an error happened', async () => {
//     const provider = providerReturns(Promise.reject('error'));
//     const wrapper = shallow(<GlobalQuickSearch resourceProvider={provider} />);

//     await searchFor('dav', wrapper);
//     expect(wrapper.find(AkQuickSearch).prop('isLoading')).toBeFalsy();
//   });

//   it('should start searching when more than one character is typed', async () => {
//     const wrapper = shallow(<GlobalQuickSearch resourceProvider={emptyResultsProvider} />);

//     searchFor('d', wrapper);
//     expect(wrapper.find(AkQuickSearch).prop('isLoading')).toBeFalsy();

//     searchFor('da', wrapper);
//     expect(wrapper.find(AkQuickSearch).prop('isLoading')).toBeTruthy();
//   });

//   it.skip('should only render result types that globalsearch understands', () => {

//   });

//   it.skip('should render initial state', () => {

//   });

//   it.skip('should render no results', () => {

//   });

// });
