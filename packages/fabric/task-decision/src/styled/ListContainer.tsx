import styled from 'styled-components';

// tslint:disable-next-line:variable-name
const ListContainer = styled.div`
  margin: 0 ${props => (props.theme.appearance === 'card' ? '2px' : 0)};
  box-sizing: border-box;
`;

export default ListContainer;
