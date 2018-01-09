import styled from 'styled-components';

export const MediaListItemNameCell = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

export const MediaListItemThumbnail = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 3px;
  background-color: #ffffff;
  box-shadow: 0 0 1px 0 rgba(23, 43, 77, 0.24);
  margin: 5px 0 5px 0;
`;

export const MediaListItemName = styled.span`
  padding-left: 16px;
  white-space: nowrap;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const MediaListWrapper = styled.div`
  tbody tr {
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #3384ff;
    }
  }
`;

export const selectedStyles = {
  backgroundColor: '#3384ff',
  color: 'rgba(255,255,255, 0.5)',
  borderBottom: '1px solid #ccc',
};
