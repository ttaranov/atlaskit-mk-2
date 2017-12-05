import * as React from 'react';
import Badge from '@atlaskit/badge';
import Lozenge from '@atlaskit/lozenge';
import Tooltip from '@atlaskit/tooltip';
import IconImage from '../../../../shared/IconImage';
import { DetailViewModel } from '../../../ViewModel';
import { Wrapper, WidgetWrapper, Widget, Title, Text } from './styled';

export interface WidgetsProps {
  details?: DetailViewModel[];
}

export default class Widgets extends React.Component<WidgetsProps> {
  renderWidget(key: any, data: DetailViewModel) {
    const { title, text, icon, badge, lozenge, label } = data;
    const attrs = [];

    if (title) {
      attrs.push(<Title key="title">{title}:</Title>);
    }

    if (icon) {
      attrs.push(
        <IconImage
          key="icon"
          src={icon.url}
          alt={icon.label}
          title={icon.label}
        />,
      );
    }

    if (badge) {
      attrs.push(
        <Badge
          key="badge"
          appearance={badge.appearance || 'default'}
          value={badge.value}
          max={badge.max}
        />,
      );
    }

    if (lozenge) {
      attrs.push(
        <Lozenge
          key="lozenge"
          appearance={lozenge.appearance || 'default'}
          isBold={lozenge.isBold}
        >
          {lozenge.text}
        </Lozenge>,
      );
    }

    if (text) {
      attrs.push(<Text key="text">{text}</Text>);
    }

    if (attrs.length === 0) {
      // tslint:disable-next-line
      console.warn(
        `Widgets: A widget doesn't contain any supported attributes: ${JSON.stringify(
          attrs,
          null,
          2,
        )}`,
      );
      return null;
    }

    return (
      <WidgetWrapper key={key}>
        <Tooltip content={label}>
          <Widget>{attrs}</Widget>
        </Tooltip>
      </WidgetWrapper>
    );
  }

  render() {
    const { details = [] } = this.props;
    return (
      <Wrapper>
        {details.map((detail, index) => this.renderWidget(index, detail))}
      </Wrapper>
    );
  }
}
