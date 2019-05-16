import { Typography } from '@material-ui/core';
import React from 'react';

export function Messages(props: { data: string[] }) {
  const { data } = props;
  return (
    <>
      <Typography component="p">Received Messages:</Typography>
      {data.map((message, i) => (
        <pre key={i}>{message}</pre>
      ))}
    </>
  );
}
