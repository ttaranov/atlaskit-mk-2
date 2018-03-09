import * as React from 'react';
import styled from 'styled-components';

export const FixedWidthContainer = styled.div`
  width: 380px;
  border: 1px dotted orange;
`;

const SectionWrapper = styled.div`
  padding: 1rem;
`;

const SectionTitle = styled.h1`
  font-size: 1.25rem;
`;

const SectionCard = styled.div`
  margin: 1rem 0;
`;

export const Section = ({
  title,
  children,
}: {
  title?: string;
  children?: any;
}) => {
  return (
    <SectionWrapper>
      {title && <SectionTitle>{title}</SectionTitle>}
      {React.Children.map(children, child => (
        <SectionCard>{child}</SectionCard>
      ))}
    </SectionWrapper>
  );
};
