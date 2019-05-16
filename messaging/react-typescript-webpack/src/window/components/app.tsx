import { CssBaseline, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Content } from './content';
import { Header } from './header';

export function App(props: { messaging?: firebase.messaging.Messaging }) {
  const { messaging } = props;
  // CSS Baseline provides sensible default styles, much like normalize.css.
  // https://material-ui.com/style/css-baseline/#css-baseline
  return (
    <CssBaseline>
      <>
        <Header />
        <div style={{ width: 1024, margin: '0 auto', padding: 20 }}>
          {messaging ? (
            <Content messaging={messaging} />
          ) : (
            <Paper style={{ padding: 10, textAlign: 'center' }}>
              <Typography variant="h6">
                Your browser does not support Messaging, or cookies are
                disabled.
              </Typography>
            </Paper>
          )}
        </div>
      </>
    </CssBaseline>
  );
}
