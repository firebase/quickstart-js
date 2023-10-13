import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: [
        'auth/anon.html',
        'auth/apple-popup.html',
        'auth/apple-redirect.html',
        'auth/customauth.html',
        'auth/email-link.html',
        'auth/email-password.html',
        'auth/facebook-credentials.html',
        'auth/facebook-popup.html',
        'auth/facebook-redirect.html',
        'auth/github-popup.html',
        'auth/github-redirect.html',
        'auth/google-credentials.html',
        'auth/google-popup.html',
        'auth/google-redirect.html',
        'auth/index.html',
        'auth/mfa-password.html',
        'auth/microsoft-popup.html',
        'auth/microsoft-redirect.html',
        'auth/multi-tenant-ui.html',
        'auth/phone-invisible.html',
        'auth/phone-simple-popup.html',
        'auth/phone-simple.html',
        'auth/phone-visible.html',
        'auth/twitter-popup.html',
        'auth/twitter-redirect.html',
      ],
    },
  },
});
