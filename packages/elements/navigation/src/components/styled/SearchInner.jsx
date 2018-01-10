import styled from 'styled-components';
import { search } from '../../shared-variables';

const searchPadding = search.layout.padding;
const SearchInner = styled.div`
  padding: ${searchPadding.top}px ${searchPadding.side}px ${searchPadding.bottom}px;
`;

SearchInner.displayName = 'SearchInner';
export default SearchInner;
