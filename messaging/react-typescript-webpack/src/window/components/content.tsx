import { Button, Paper } from '@material-ui/core';
import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import { Information } from './information';
import { Messages } from './messages';

export function Content(props: { messaging: firebase.messaging.Messaging }) {
  const { messaging } = props;

  const [token, setToken] = useState<string | null>(null);
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function requestPermission() {
    // The Notification object is a part of Notifications API.
    // https://developer.mozilla.org/en-US/docs/Web/API/Notification
    // https://developer.mozilla.org/en-US/docs/Web/API/Notification/permission
    if (Notification.permission === 'default') {
      // The user hasn't been asked yet if they want to receive notifications.
      await Notification.requestPermission();
    }

    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted.');
    }
  }

  async function getToken() {
    try {
      const newToken = await messaging.getToken();
      setToken(newToken);
      // TODO(developer): Send the current token to your server.
      // Send the Instance ID token your application server, so that it can:
      // - send messages back to this app
      // - subscribe/unsubscribe the token from topics
    } catch (error) {
      console.warn('Unable to get token.', error);
    }
  }

  async function deleteToken() {
    if (token) {
      try {
        await messaging.deleteToken(token);
        setToken(null);
      } catch (error) {
        console.warn('Unable to delete token', error);
      }
    }
  }

  useEffect(() => {
    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.setBackgroundMessageHandler` handler.
    //
    // For more information, see the chart at:
    // https://firebase.google.com/docs/cloud-messaging/js/receive
    const onMessageUnsubscribe = messaging.onMessage(message => {
      // Add the new message to the messages array.
      // Creates a new array to let react see the state change.
      setReceivedMessages([
        ...receivedMessages,
        JSON.stringify(message, null, 2)
      ]);
    });

    // Callback fired if FCM Registration Token is updated.
    const onTokenRefreshUnsubscribe = messaging.onTokenRefresh(() => {
      getToken();
    });

    // The function returned from onMessage and onTokenRefresh are used to stop
    // listening to their respective events. This is what we should to do as
    // cleanup.
    // https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    return () => {
      onMessageUnsubscribe();
      onTokenRefreshUnsubscribe();
    };
  });

  useEffect(() => {
    // Call getToken when component mounts if Notification permission is
    // already granted.
    if (Notification.permission === 'granted') {
      getToken();
    }
    // Passing an empty array as the second argument to useEffect tells React
    // that your effect doesn’t depend on any values from props or state, so it
    // never needs to re-run, effectively making it run only when the component
    // mounts.
    // https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects
  }, []);

  // Clear received messages when token changes.
  useEffect(() => {
    setReceivedMessages([]);
  }, [token]);

  function getButton() {
    let onClickHandler: () => Promise<void>;
    let text: string;
    if (Notification.permission === 'default') {
      // It is possible to ask for Notification Permission because it's not
      // explicitly granted or denied yet.
      onClickHandler = requestPermission;
      text = 'Request Permission';
    } else if (Notification.permission === 'granted' && !token) {
      // Notification Permission is granted but there is no token.
      onClickHandler = getToken;
      text = 'Get Token';
    } else if (token) {
      onClickHandler = deleteToken;
      text = 'Delete Token';
    } else {
      return null;
    }

    return (
      <Button
        style={{ marginTop: 10 }}
        color="primary"
        variant="contained"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await onClickHandler();
          setIsLoading(false);
        }}
      >
        {text}
      </Button>
    );
  }

  // CSS Baseline provides sensible default styles, much like normalize.css.
  // https://material-ui.com/style/css-baseline/#css-baseline
  return (
    <>
      <Paper style={{ marginBottom: 20, padding: 10 }}>
        <Information permission={Notification.permission} token={token} />
        {getButton()}
      </Paper>
      {/* Only display received messages if there are any */}
      {receivedMessages.length > 0 ? (
        <Paper style={{ padding: 10 }}>
          <Messages data={receivedMessages} />
        </Paper>
      ) : null}
    </>
  );
}
