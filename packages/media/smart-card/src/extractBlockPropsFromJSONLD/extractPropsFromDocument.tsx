import * as React from 'react';
import { BlockCardResolvedViewProps } from '@atlaskit/media-ui';
import { extractPropsFromObject } from './extractPropsFromObject';
import { relativeTime } from '../utils';
import ChatIcon from '@atlaskit/icon/glyph/comment';
import { colors } from '@atlaskit/theme';

type Person = {
  name: string;
  icon?: {
    url: string;
  };
};

export function extractPropsFromDocument(
  json: any,
): BlockCardResolvedViewProps {
  const props = extractPropsFromObject(json);

  props.icon = {
    url:
      'http://icons.iconarchive.com/icons/everaldo/crystal-clear/128/Action-file-new-icon.png',
  };

  props.details = [];

  if (json.commentCount) {
    props.details.push({
      icon: (
        <ChatIcon
          label=""
          key="comments-count-icon"
          size="medium"
          primaryColor={colors.N600}
        />
      ),
      text: `${json.commentCount}`,
    });
  }

  if (json.updated && json.updatedBy) {
    let lastPerson: Person;

    if (Array.isArray(json.updatedBy)) {
      lastPerson = json.updatedBy.pop();
      props.details.concat(
        json.updatedBy.map((person: Person) => ({
          text: person.name,
          icon: person.icon,
        })),
      );
    } else {
      lastPerson = json.updatedBy;
    }

    props.description = {
      text: `Modified by ${lastPerson.name} on ${relativeTime(json.updated)}`,
    };
  } else if (json.attributedTo) {
    const person = Array.isArray(json.attributedTo)
      ? json.attributedTo.pop()
      : json.attributedTo;

    props.description = {
      text: `Created by ${person.name} on ${relativeTime(json.dateCreated)}`,
    };
  }

  if (json.image && json.image.url) {
    props.preview = json.image.url;
  }

  return props;
}
