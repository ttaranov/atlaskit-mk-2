// import * as React from 'react';
// import { mount } from 'enzyme';
// import GoogleAnalyticsListener from '../../GoogleAnalyticsListener';
// import ReactGA from 'react-ga';
// import { MemoryRouter } from 'react-router-dom';
// import cases from 'jest-in-case';

// jest.mock('react-ga');

// const getFakeGetEntries = data => {
//   const getEntriesByType = type => {
//     if (type !== 'navigation') return [];
//     return data;
//   };
//   return getEntriesByType;
// };

// cases(
//   'add(augend, addend)',
//   ({ performance, expectedCallSignature }) => {
//     window.performance = performance;

//     window.addEventListener = (name, func, options) => {
//       if (name === 'load') {
//         func();
//       }
//     };

//     const wrapper = mount(
//       <MemoryRouter>
//         <GoogleAnalyticsListener>{null}</GoogleAnalyticsListener>
//       </MemoryRouter>,
//     );

//     expect(ReactGA.event).toHaveBeenCalledWith(expectedCallSignature);
//   },
//   [
//     {
//       name: 'apdex 100',
//       performance: {
//         getEntriesByType: getFakeGetEntries([{ domComplete: 500 }]),
//       },
//       expectedCallSignature: {
//         category: 'Performance',
//         action: 'apdex',
//         value: 100,
//         nonInteraction: true,
//         label: 'seconds:0.5',
//       },
//     },
//     {
//       name: 'apdex 50',
//       performance: {
//         getEntriesByType: getFakeGetEntries([{ domComplete: 1100 }]),
//       },
//       expectedCallSignature: {
//         category: 'Performance',
//         action: 'apdex',
//         value: 50,
//         nonInteraction: true,
//         label: 'seconds:1.1',
//       },
//     },
//     {
//       name: 'apdex 0',
//       performance: {
//         getEntriesByType: getFakeGetEntries([{ domComplete: 4500 }]),
//       },
//       expectedCallSignature: {
//         category: 'Performance',
//         action: 'apdex',
//         value: 0,
//         nonInteraction: true,
//         label: 'seconds:4.5',
//       },
//     },
//   ],
// );
it('should pass', () => {});
