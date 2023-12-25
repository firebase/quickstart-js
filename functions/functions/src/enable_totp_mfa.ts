// const { getAuth } = require('firebase-admin/auth');
// const admin = require('firebase-admin');

// admin.initializeApp({
//   credential: admin.credential.cert('../../.creds/test-2fa-issue-firebase-adminsdk-ixlfh-ed225d2768.json'),
// });

// getAuth()
//   .projectConfigManager()
//   .updateProjectConfig({
//     multiFactorConfig: {
//       state: 'ENABLED',
//       providerConfigs: [
//         {
//           state: 'ENABLED',
//           totpProviderConfig: {
//             adjacentIntervals: 5,
//           },
//         },
//       ],
//     },
//   });
