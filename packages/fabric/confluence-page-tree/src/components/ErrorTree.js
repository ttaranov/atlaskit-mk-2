// @flow
import React from 'react';
import Button from '@atlaskit/button';
import { ErrorTreeContainer, DescriptionContainer } from '../styled';
import { getI18n } from '../i18n-text';
import emptyImg from '../assets/empty.png';
import errorImg from '../assets/error.png';

type ErrorTreeProps = {
  type?: 'error' | 'noaccess' | 'empty',
  readOnly?: boolean,
};

const ErrorTree = ({ type, readOnly }: ErrorTreeProps) => {
  const getErrorTitle = () => {
    return getI18n()[type].title;
  };

  const getErrorDescription = () => {
    return getI18n()[type].description;
  };

  const imgMap = {
    error: errorImg,
    noaccess: errorImg,
    empty: emptyImg,
  };

  return (
    <ErrorTreeContainer>
      <img src={imgMap[type]} />
      <h3>{getErrorTitle()}</h3>
      <DescriptionContainer>{getErrorDescription()}</DescriptionContainer>
      {type === 'empty' ? (
        <Button appearance="primary" isDisabled={readOnly}>
          {getI18n().create}
        </Button>
      ) : null}
    </ErrorTreeContainer>
  );
};

ErrorTree.defaultProps = {
  type: 'error',
  readOnly: false,
};

export { ErrorTree };
