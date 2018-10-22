import * as React from 'react';
import {
  BlockCardResolvedViewProps,
  LozengeViewModel,
} from '@atlaskit/media-ui';
import { relativeTime } from '../utils';
import ChatIcon from '@atlaskit/icon/glyph/comment';
import { colors } from '@atlaskit/theme';

export const buildTitle = (json: any) => {
  let name = json.name && json.name.trim();
  return name ? { title: { text: name } } : {};
};

export const buildDescription = (json: any) => {
  const summary = json.summary && json.summary.trim();
  return summary ? { description: { text: summary } } : {};
};

export const buildLink = (json: any) => {
  const url = json['@url'] && json['@url'].trim();
  return url ? { link: url } : {};
};

export const buildByline = (json: any) => {
  const updatedBy =
    json.updatedBy && json.updatedBy.name ? ' by ' + json.updatedBy.name : '';
  if (json.dateCreated || json.updated) {
    return {
      byline: {
        text: json.updated
          ? `Updated ${relativeTime(json.updated)}${updatedBy}`
          : `Created ${relativeTime(json.dateCreated)}`,
      },
    };
  }
  return {};
};

export const buildUser = (json: any) => {
  if (json.assignedBy && (json.assignedBy.image || json.assignedBy.name)) {
    return {
      user: {
        ...(json.assignedBy.image ? { icon: json.assignedBy.image } : {}),
        ...(json.assignedBy.name ? { name: json.assignedBy.name } : {}),
      },
    };
  }
  return {};
};

export const buildUsers = (json: any) => {
  if (Array.isArray(json.assignedTo) && json.assignedTo.length > 0) {
    return {
      users: json.assignedTo.map((assignee: any) => ({
        icon: assignee.image,
        name: assignee.name,
      })),
    };
  }
  return {};
};

export const buildCommentCount = (json: any) => {
  if (!isNaN(Number(json.commentCount)) && Number(json.commentCount) > 0) {
    return {
      icon: (
        <ChatIcon
          label=""
          key="comments-count-icon"
          size="medium"
          primaryColor={colors.N600}
        />
      ),
      text: String(json.commentCount),
    };
  }
  return {};
};

export const buildDetailsLozenge = (json: any) => {
  if (json.taskStatus && json.taskStatus.name) {
    return {
      lozenge: {
        text: json.taskStatus.name,
        appearance: 'success',
      } as LozengeViewModel,
    };
  }
  return {};
};

export const buildDetails = (json: any) => {
  if (json.taskStatus || json.commentCount) {
    return {
      details: [buildDetailsLozenge(json), buildCommentCount(json)],
    };
  }
  return {};
};

export const buildContext = (json: any) => {
  const genName =
    json.generator && json.generator.name && json.generator.name.trim();
  if (genName) {
    let additional =
      (json.context &&
        json.context.name &&
        json.context.name.trim() &&
        ` / ${json.context.name.trim()}`) ||
      '';
    return {
      context: {
        text: genName + additional,
        ...(json.generator.icon ? { icon: json.generator.icon } : {}),
      },
    };
  }
  return {};
};

export function extractBlockViewPropsFromTask(
  json: any,
): BlockCardResolvedViewProps {
  if (!json) {
    throw new Error('smart-card: data is not parsable JSON-LD.');
  }

  const props: BlockCardResolvedViewProps = {
    ...buildContext(json),
    ...buildTitle(json),
    ...buildDescription(json),
    ...buildLink(json),
    ...buildByline(json),
    ...buildUser(json),
    ...buildUsers(json),
    ...buildDetails(json),
  };

  return props;
}
