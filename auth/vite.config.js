import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/',
  resolve: {
    alias: {
      'firebase/app': path.resolve(__dirname, '../../firebase-js-sdk/packages/app/dist/esm/index.esm.js'),
      'firebase/auth': path.resolve(__dirname, '../../firebase-js-sdk/packages/auth/dist/esm/index.js'),
      '@firebase/app': path.resolve(__dirname, '../../firebase-js-sdk/packages/app/dist/esm/index.esm.js'),
      '@firebase/auth': path.resolve(__dirname, '../../firebase-js-sdk/packages/auth/dist/esm/index.js'),
    }
  },
  build: {
    rollupOptions: {
      input: [
        'anon.html',
        'apple-popup.html',
        'apple-redirect.html',
        'customauth.html',
        'email-link.html',
        'email-password.html',
        'facebook-credentials.html',
        'facebook-popup.html',
        'facebook-redirect.html',
        'github-popup.html',
        'github-redirect.html',
        'google-credentials.html',
        'google-popup.html',
        'google-redirect.html',
        'index.html',
        'mfa-password.html',
        'microsoft-popup.html',
        'microsoft-redirect.html',
        'multi-tenant-ui.html',
        'passkey.html',
        'phone-invisible.html',
        'phone-simple-popup.html',
        'phone-simple.html',
        'phone-visible.html',
        'twitter-popup.html',
        'twitter-redirect.html',
      ],
    },
  },
});
