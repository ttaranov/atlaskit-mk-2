// @flow
import React from 'react';
import Badge from '../src';

export default function StyleGuide() {
  return (
    <div>
      <div>
        <span style={{ margin: 5 }}>
          <Badge appearance="added" value={12} />
        </span>
        <span style={{ margin: 5 }}>
          <Badge appearance="added" value={100} max={99} />
        </span>
        <span style={{ margin: 5 }}>
          <Badge appearance="added" value={2} />
        </span>
      </div>
      <div>
        <div>
          <span style={{ margin: 5 }}>
            <Badge appearance="default" value={12} style={{ margin: 10 }} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="default" value={100} max={99} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="default" value={2} />
          </span>
        </div>
        <div>
          <span style={{ margin: 5 }}>
            {' '}
            <Badge appearance="important" value={12} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="important" value={100} max={99} />
          </span>
          <span style={{ margin: 5 }}>
            {' '}
            <Badge appearance="important" value={2} />
          </span>
        </div>
        <div>
          <span style={{ margin: 5 }}>
            {' '}
            <Badge appearance="primaryInverted" value={12} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="primaryInverted" value={100} max={99} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="primaryInverted" value={2} />
          </span>
        </div>
        <div>
          <span style={{ margin: 5 }}>
            <Badge appearance="primary" value={12} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="primary" value={100} max={99} />
          </span>
          <span style={{ margin: 5 }}>
            <Badge appearance="primary" value={2} />
          </span>
        </div>
        <span style={{ margin: 5 }}>
          <Badge appearance="removed" />
        </span>
        <span style={{ margin: 5 }}>
          <Badge appearance="removed" />
        </span>
        <span style={{ margin: 5 }}>
          <Badge appearance="removed" />
        </span>
      </div>
    </div>
  );
}
