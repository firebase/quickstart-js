import { ensureInitialized, fetchAndActivate, getRemoteConfig, getValue } from 'firebase/remote-config';
import { firebaseConfig } from './config';
import { initializeApp } from 'firebase/app';

initializeApp(firebaseConfig);

const remoteConfig = getRemoteConfig();

remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

remoteConfig.defaultConfig = ({
  'welcome_message': 'Welcome'
});

ensureInitialized(remoteConfig)
  .then(() => {
    console.log('Firebase Remote Config is initialized');
    showWelcomeMessage();
  })
  .catch((err) => {
    console.error('Firebase Remote Config failed to initialize', err);
  });

function showWelcomeMessage() {
  const val = getValue(remoteConfig, 'welcome_message');
  const welcome_element = document.getElementById('welcome_message')!;
  welcome_element.innerText = val.asString() + ' (' + val.getSource() + ')';
}

function fetchConfig() {
  const welcome_element = document.getElementById('welcome_message')!;
  welcome_element.innerText = 'loading...';
  fetchAndActivate(remoteConfig)
    .then(() => {
      showWelcomeMessage();
    })
    .catch((err) => {
      console.error(err);
    });
}

document.getElementById('fetch-config')!.addEventListener('click', fetchConfig);
