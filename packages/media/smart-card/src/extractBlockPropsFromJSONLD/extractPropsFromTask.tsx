import * as React from 'react';
import { BlockCard } from '@atlaskit/media-ui';
import { relativeTime } from '../utils';
import ChatIcon from '@atlaskit/icon/glyph/comment';
import { colors } from '@atlaskit/theme';

const propValueOfTypeOr = (
  propName: string,
  typeName: string,
  alternative: any,
  data: any,
): any => {
  return typeof data[propName] === typeName ? data[propName] : alternative;
};

const stringPropValOrEmpty = (propName: string, data: any): string => {
  return propValueOfTypeOr(propName, 'string', '', data);
};

export function extractPropsFromTask(json: any): BlockCard.ResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: BlockCard.ResolvedViewProps = {
    title: { text: stringPropValOrEmpty('name', json) },
    description: { text: stringPropValOrEmpty('summary', json) },
  };

  if (json.url) {
    props.link = String(json.url);
  }

  if (json.dateCreated) {
    props.description = {
      text: `Created at ${relativeTime(json.dateCreated)}`,
    };
  }

  if (json.assignedBy) {
    props.user = {
      icon: json.assignedBy.image,
      name: json.assignedBy.name,
    };
  }

  if (json.assignedTo && Array.isArray(json.assignedTo)) {
    props.users = json.assignedTo.map((assignee: any) => ({
      icon: assignee.image,
      name: assignee.name,
    }));
  }

  if (json.context && json.context.name) {
    props.byline = { text: json.context.name };
  }

  if (json.tag && Array.isArray(json.tag)) {
    props.details = (props.details || []).concat(
      json.tag.map((tag: any) => ({
        lozenge: {
          text: tag.name,
          appearance: 'default',
        },
      })),
    );
  }

  if (json.commentCount) {
    props.details = (props.details || []).concat([
      {
        icon: (
          <ChatIcon
            label=""
            key="comments-count-icon"
            size="medium"
            primaryColor={colors.N600}
          />
        ),
        text: `${json.commentCount}`,
      },
    ]);
  }

  if (json.generator && (json.generator.name || json.generator.icon)) {
    props.context = {
      text: json.generator.name,
      icon: json.generator.icon,
    };
  }

  return props;
}
