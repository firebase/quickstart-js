import { Typography } from '@material-ui/core';
import React from 'react';

export function Information(props: {
  permission: NotificationPermission;
  token: string | null;
}) {
  const { permission, token } = props;
  return (
    <>
      <Typography component="p">
        Notification Permission: <code>{permission}</code>
      </Typography>
      <Typography component="p">
        Token:
        {token ? (
          <>
            <br />
            <code style={{ wordBreak: 'break-all' }}>{token}</code>
          </>
        ) : (
          ' None'
        )}
      </Typography>
    </>
  );
}
