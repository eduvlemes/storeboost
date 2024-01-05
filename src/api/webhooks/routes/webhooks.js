//const checkWidgetInstallationPolicy = require('./../../../config/policies/checkWidgetInstallation');
const path = require('path');
const checkWidgetInstallationPolicy = require(path.resolve(__dirname, '../../../config/policies/checkWidgetInstallation'));


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
  