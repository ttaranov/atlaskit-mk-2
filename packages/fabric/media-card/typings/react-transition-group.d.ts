import T from 'react-transition-group/Transition';

declare module 'react-transition-group/Transition' {
  let Transition: T;

  // an extra function used by the tests for configuring mocks
  function __setStatus__(status: 'entering' | 'entered' | 'exiting' | 'exited');
}
