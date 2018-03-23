import { CardViewProps } from './CardView';

function getDateDetails(json: any) {
  if (!json['atl:lastActivity']) {
    return [];
  }
  return [
    {
      icon: 'https://d2f24wggpacxal.cloudfront.net/trello/activity@2x.png',
      text: json['atl:lastActivity'],
    },
  ];
}

function getTagDetails(json: any) {
  if (!Array.isArray(json.tag) || json.tag.length === 0) {
    return [];
  }
  return json.tag.map(label => ({
    lozenge: {
      text: label.name,
    },
  }));
}

export function convert(json: any): CardViewProps {
  const props: CardViewProps = {};
  if (!json) {
    return props;
  }

  if (json.url) {
    props.link = String(json.url);
  }

  return {
    ...props,
    context: {
      text: String(
        (Array.isArray(json.context) &&
          json.context[0] &&
          json.context[0].name) ||
          '',
      ),
      icon:
        'https://a.trellocdn.com/images/ios/0307bc39ec6c9ff499c80e18c767b8b1/apple-touch-icon-152x152-precomposed.png',
    },
    title: {
      text: String(json.name || ''),
    },
    description: {
      text: String(json.summary || ''),
    },
    details: [...getTagDetails(json), ...getDateDetails(json)],
  };
}
