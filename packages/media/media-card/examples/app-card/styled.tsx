import * as React from 'react';
import styled from 'styled-components';

export const FixedWidthContainer: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  width: 380px;
  border: 1px dotted orange;
`;

const SectionWrapper: React.ComponentClass<
  React.HTMLAttributes<{}>
> = styled.div`
  padding: 1rem;
`;

const SectionTitle: React.ComponentClass<React.HTMLAttributes<{}>> = styled.h1`
  font-size: 1.25rem;
`;

const SectionCard: React.ComponentClass<React.HTMLAttributes<{}>> = styled.div`
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
