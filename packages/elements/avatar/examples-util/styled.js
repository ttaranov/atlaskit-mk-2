// @flow
import styled from 'styled-components';
// TODO: remove
import {
  akColorR50,
  akColorN100,
  akColorR400,
} from '@atlaskit/util-shared-styles';

export const AvatarRow = styled.div`
  align-items: baseline;
  display: flex;
  margin-top: 10px;
`;
export const AvatarCol = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
`;
export const AvatarColLabel = styled.div`
  align-items: center;
  background-color: #f4f5f7;
  border-radius: 0.33em;
  color: #344563;
  display: flex;
  font-size: 0.7em;
  font-weight: 500;
  height: 2.1em;
  justify-content: center;
  margin-top: 10px;
  padding: 0 1em;
  text-transform: uppercase;
`;

// TODO: combine with other file
export const Wrapper = styled.div``;

export const Note = styled.div`
  color: ${akColorN100};
  font-size: ${props => (props.size === 'large' ? '1.1em' : '0.8rem')};
  margin-top: 4px;
  margin-bottom: 6px;

  code {
    background-color: ${akColorR50};
    border-radius: 0.2em;
    color: ${akColorR400};
    font-size: 0.85em;
    line-height: 1.1;
    padding: 0.1em 0.4em;
  }
`;

export const HR = styled.div`
  border: 0;
  border-top: 1px solid #ccc;
  margin-bottom: 1em;
  margin-top: 1em;
`;
