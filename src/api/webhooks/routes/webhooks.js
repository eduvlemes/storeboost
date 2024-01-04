const checkWidgetInstallationPolicy = require('../../../src/config/policies/checkWidgetInstallation');

module.exports = {
    routes: [
      {
       method: 'POST',
       path: '/webhooks/file-upload',
       handler: 'webhooks.fileUpload',
       config: {
         policies: [checkWidgetInstallationPolicy],
         middlewares: [],
       },
      },
    ],
  };
  