// @flow
import * as resultTypes from './components/Results';

export { default as QuickSearch } from './components/QuickSearch';
export {
  default as ResultItemGroup,
} from './components/ResultItem/ResultItemGroup';
export { default as ObjectResult } from './components/Results/ObjectResult';
export { default as PersonResult } from './components/Results/PersonResult';
export {
  default as ContainerResult,
} from './components/Results/ContainerResult';
export { default as ResultBase } from './components/Results/ResultBase';

// Legacy backward compatible exports from quick-search inside @atlaskit/navigation:
export {
  default as NavigationItemGroup,
} from './components/ResultItem/ResultItemGroup';
export { default as NavigationItem } from './components/ResultItem/ResultItem';
export { default as AkQuickSearch } from './components/QuickSearch';
export { resultTypes as quickSearchResultTypes };
